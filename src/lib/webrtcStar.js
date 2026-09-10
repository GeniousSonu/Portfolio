'use client';

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase/client';

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Creates an ICE candidate buffer that flushes writes to Firestore in batches
 * every 250ms, drastically reducing write quota consumption during negotiation.
 */
function createIceCandidateBuffer(docRef, fieldName) {
  let buffer = [];
  let timer = null;

  const flush = () => {
    if (buffer.length === 0) return;
    const toFlush = [...buffer];
    buffer = [];
    timer = null;

    updateDoc(docRef, {
      [fieldName]: arrayUnion(...toFlush),
      updatedAt: serverTimestamp(),
    }).catch(() => {});
  };

  return {
    add(candidate) {
      if (!candidate) return;
      buffer.push({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      });

      if (!timer) {
        timer = setTimeout(flush, 250);
      }
    },
    destroy() {
      if (timer) clearTimeout(timer);
      flush();
    },
  };
}

/**
 * PRESENTER: Manages 1-to-N star connections to all viewers in the room.
 */
export class PresenterManager {
  constructor(roomId, presenterUid, stream) {
    this.roomId = roomId;
    this.presenterUid = presenterUid;
    this.stream = stream;
    this.peerConnections = new Map(); // viewerUid -> RTCPeerConnection
    this.unsubscribers = new Map(); // viewerUid -> unsubscribe function
    this.candidateBuffers = new Map();
  }

  /**
   * Connect to a new viewer who has joined the room.
   */
  async connectToViewer(viewerUid) {
    if (this.peerConnections.has(viewerUid)) return;

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnections.set(viewerUid, pc);

    // Add local screen-share tracks to peer connection
    this.stream.getTracks().forEach((track) => pc.addTrack(track, this.stream));

    const signalDocRef = doc(
      db,
      'rooms',
      this.roomId,
      'signals',
      this.presenterUid,
      'peers',
      viewerUid
    );

    const iceBuffer = createIceCandidateBuffer(signalDocRef, 'presenterCandidates');
    this.candidateBuffers.set(viewerUid, iceBuffer);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        iceBuffer.add(event.candidate);
      }
    };

    // Create SDP Offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Initialize pairwise signaling document
    await setDoc(signalDocRef, {
      presenterUid: this.presenterUid,
      viewerUid,
      offer: { type: offer.type, sdp: offer.sdp },
      answer: null,
      presenterCandidates: [],
      viewerCandidates: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000), // 1h TTL
    });

    // Listen for viewer answer and candidates
    const unsub = onSnapshot(signalDocRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      // Handle viewer answer
      if (data.answer && !pc.currentRemoteDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      // Handle viewer ICE candidates
      if (Array.isArray(data.viewerCandidates) && data.viewerCandidates.length > 0) {
        for (const c of data.viewerCandidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch {}
        }
      }
    });

    this.unsubscribers.set(viewerUid, unsub);
  }

  /**
   * Disconnect a single viewer who has left the room.
   */
  disconnectViewer(viewerUid) {
    const unsub = this.unsubscribers.get(viewerUid);
    if (unsub) {
      unsub();
      this.unsubscribers.delete(viewerUid);
    }

    const buffer = this.candidateBuffers.get(viewerUid);
    if (buffer) {
      buffer.destroy();
      this.candidateBuffers.delete(viewerUid);
    }

    const pc = this.peerConnections.get(viewerUid);
    if (pc) {
      pc.close();
      this.peerConnections.delete(viewerUid);
    }

    const signalDocRef = doc(
      db,
      'rooms',
      this.roomId,
      'signals',
      this.presenterUid,
      'peers',
      viewerUid
    );
    deleteDoc(signalDocRef).catch(() => {});
  }

  /**
   * Teardown entire presenter session.
   */
  destroy() {
    this.peerConnections.forEach((pc, viewerUid) => {
      this.disconnectViewer(viewerUid);
    });

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
  }
}

/**
 * VIEWER: Connects to an active presenter in the room.
 */
export class ViewerManager {
  constructor(roomId, presenterUid, viewerUid, onStreamReceived) {
    this.roomId = roomId;
    this.presenterUid = presenterUid;
    this.viewerUid = viewerUid;
    this.onStreamReceived = onStreamReceived;
    this.pc = null;
    this.unsub = null;
    this.iceBuffer = null;
  }

  start() {
    const signalDocRef = doc(
      db,
      'rooms',
      this.roomId,
      'signals',
      this.presenterUid,
      'peers',
      this.viewerUid
    );

    this.pc = new RTCPeerConnection(RTC_CONFIG);
    this.iceBuffer = createIceCandidateBuffer(signalDocRef, 'viewerCandidates');

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceBuffer.add(event.candidate);
      }
    };

    this.pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.onStreamReceived(event.streams[0]);
      }
    };

    let hasAnswered = false;

    this.unsub = onSnapshot(signalDocRef, async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      // When presenter offer arrives, set remote description & reply with answer
      if (data.offer && !this.pc.currentRemoteDescription && !hasAnswered) {
        hasAnswered = true;
        await this.pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        await updateDoc(signalDocRef, {
          answer: { type: answer.type, sdp: answer.sdp },
          updatedAt: serverTimestamp(),
        });
      }

      // Handle presenter ICE candidates
      if (Array.isArray(data.presenterCandidates) && data.presenterCandidates.length > 0) {
        for (const c of data.presenterCandidates) {
          try {
            await this.pc.addIceCandidate(new RTCIceCandidate(c));
          } catch {}
        }
      }
    });
  }

  destroy() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
    if (this.iceBuffer) {
      this.iceBuffer.destroy();
      this.iceBuffer = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    const signalDocRef = doc(
      db,
      'rooms',
      this.roomId,
      'signals',
      this.presenterUid,
      'peers',
      this.viewerUid
    );
    deleteDoc(signalDocRef).catch(() => {});
  }
}
