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

/**
 * WebRTC ICE Configuration:
 * Configures both primary STUN servers for direct peer-to-peer reflection and
 * TURN relay fallback servers (Metered Open Relay project + custom Cloudflare Realtime TURN if provided)
 * for symmetric NAT, mobile CGNAT, and restricted network environments.
 */
export function getRtcConfig() {
  const customTurnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const customTurnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const customTurnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  const iceServers = [
    // 1. Google Public STUN servers (primary for direct peer reflection)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.relay.metered.ca:80' },
  ];

  // If custom Cloudflare or other TURN service is specified in environment
  if (customTurnUrl) {
    iceServers.push({
      urls: customTurnUrl.split(',').map((u) => u.trim()),
      username: customTurnUsername || undefined,
      credential: customTurnCredential || undefined,
    });
  }

  // 2. Metered Open Relay Project TURN Fallback (Free, high-availability public relay)
  // Supports UDP and TCP transports across standard HTTP/HTTPS ports 80 & 443
  iceServers.push(
    {
      urls: [
        'turn:relay.metered.ca:80',
        'turn:relay.metered.ca:443',
        'turn:relay.metered.ca:443?transport=tcp',
      ],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turns:relay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    }
  );

  return {
    iceServers,
    iceCandidatePoolSize: 10,
  };
}

export const RTC_CONFIG = getRtcConfig();


/**
 * High-quality audio constraints for Discord-style real-time voice chat
 */
export const AUDIO_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
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

    pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC Presenter ICE] Viewer ${viewerUid} ICE state: ${pc.iceConnectionState}`);
    };
    pc.onconnectionstatechange = () => {
      console.log(`[WebRTC Presenter Conn] Viewer ${viewerUid} connection state: ${pc.connectionState}`);
    };

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

    this.pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC Viewer ICE] Presenter ${this.presenterUid} ICE state: ${this.pc?.iceConnectionState}`);
    };
    this.pc.onconnectionstatechange = () => {
      console.log(`[WebRTC Viewer Conn] Presenter ${this.presenterUid} connection state: ${this.pc?.connectionState}`);
    };

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

/**
 * VOICE MESH: Full peer-to-peer audio mesh for up to 6 participants
 * with per-peer local mute, speaking detection, and background auto-mute.
 */
export class VoiceMeshManager {
  constructor(roomId, localUid, localStream, callbacks = {}) {
    this.roomId = roomId;
    this.localUid = localUid;
    this.localStream = localStream;
    this.onPeerStream = callbacks.onPeerStream || (() => {});
    this.onPeerLeft = callbacks.onPeerLeft || (() => {});
    this.onSpeakingChange = callbacks.onSpeakingChange || (() => {});
    this.onConnectionStateChange = callbacks.onConnectionStateChange || (() => {});

    this.peerConnections = new Map(); // peerUid -> RTCPeerConnection
    this.unsubscribers = new Map(); // peerUid -> unsub function
    this.candidateBuffers = new Map(); // peerUid -> buffer
    this.audioElements = new Map(); // peerUid -> HTMLAudioElement
    this.locallyMutedPeers = new Set(); // Set of peerUids muted for this client
    this.isMuted = false;
    this.isDeafened = false;

    // Web Audio Speaking Detector
    this.audioContext = null;
    this.analysers = new Map(); // peerUid or 'local' -> AnalyserNode
    this.speakingStates = new Map(); // peerUid or 'local' -> boolean
    this.meterInterval = null;

    this.initAudioAnalyser();
  }

  initAudioAnalyser() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();

      // Local microphone analyser
      if (this.localStream && this.localStream.getAudioTracks().length > 0) {
        const source = this.audioContext.createMediaStreamSource(this.localStream);
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.4;
        source.connect(analyser);
        this.analysers.set('local', analyser);
      }

      this.meterInterval = setInterval(() => this.checkSpeakingLevels(), 100);
    } catch (e) {
      console.warn('[The Lounge Voice] AudioContext setup notice:', e);
    }
  }

  attachRemoteAnalyser(peerUid, stream) {
    if (!this.audioContext) return;
    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const source = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      this.analysers.set(peerUid, analyser);
    } catch {}
  }

  checkSpeakingLevels() {
    const buffer = new Uint8Array(128);
    this.analysers.forEach((analyser, id) => {
      // If local and mic is muted, volume is 0
      if (id === 'local' && this.isMuted) {
        if (this.speakingStates.get('local')) {
          this.speakingStates.set('local', false);
          this.onSpeakingChange(this.localUid, false);
        }
        return;
      }

      analyser.getByteFrequencyData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i];
      }
      const avg = sum / buffer.length;
      const isSpeaking = avg > 12; // Speaking threshold

      const prevState = this.speakingStates.get(id) || false;
      if (isSpeaking !== prevState) {
        this.speakingStates.set(id, isSpeaking);
        const targetUid = id === 'local' ? this.localUid : id;
        this.onSpeakingChange(targetUid, isSpeaking);
      }
    });
  }

  /**
   * Sync active voice participants from Firestore presence.
   */
  syncVoiceParticipants(voicePeerUids) {
    const currentPeers = new Set(voicePeerUids.filter((uid) => uid !== this.localUid));

    // Connect to newly joined voice peers
    currentPeers.forEach((peerUid) => {
      if (!this.peerConnections.has(peerUid)) {
        this.connectToPeer(peerUid);
      }
    });

    // Disconnect peers who left voice
    this.peerConnections.forEach((_, peerUid) => {
      if (!currentPeers.has(peerUid)) {
        this.disconnectPeer(peerUid);
      }
    });
  }

  async connectToPeer(peerUid) {
    if (this.peerConnections.has(peerUid)) return;

    // Deterministic caller assignment: lower UID string creates offer
    const isCaller = this.localUid < peerUid;
    const callerUid = isCaller ? this.localUid : peerUid;
    const calleeUid = isCaller ? peerUid : this.localUid;

    const signalDocRef = doc(
      db,
      'rooms',
      this.roomId,
      'voiceSignals',
      callerUid,
      'peers',
      calleeUid
    );

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnections.set(peerUid, pc);

    pc.oniceconnectionstatechange = () => {
      const iceState = pc.iceConnectionState;
      const connState = pc.connectionState;
      console.log(`[WebRTC Voice ICE] Peer ${peerUid} ICE state: ${iceState} (connection: ${connState})`);
      this.onConnectionStateChange(peerUid, iceState, connState);
    };

    pc.onconnectionstatechange = () => {
      const iceState = pc.iceConnectionState;
      const connState = pc.connectionState;
      console.log(`[WebRTC Voice Conn] Peer ${peerUid} connection state: ${connState} (ICE: ${iceState})`);
      this.onConnectionStateChange(peerUid, iceState, connState);
    };

    // Add local mic track
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => pc.addTrack(track, this.localStream));
    }

    const candidateField = isCaller ? 'callerCandidates' : 'calleeCandidates';
    const iceBuffer = createIceCandidateBuffer(signalDocRef, candidateField);
    this.candidateBuffers.set(peerUid, iceBuffer);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        iceBuffer.add(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        const remoteStream = event.streams[0];
        let audioEl = this.audioElements.get(peerUid);
        if (!audioEl) {
          audioEl = new Audio();
          audioEl.autoplay = true;
          this.audioElements.set(peerUid, audioEl);
        }
        audioEl.srcObject = remoteStream;
        audioEl.muted = this.locallyMutedPeers.has(peerUid) || this.isDeafened;
        audioEl.play().catch(() => {});

        this.attachRemoteAnalyser(peerUid, remoteStream);
        this.onPeerStream(peerUid, remoteStream);
      }
    };

    if (isCaller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await setDoc(
        signalDocRef,
        {
          callerUid,
          calleeUid,
          offer: { type: offer.type, sdp: offer.sdp },
          answer: null,
          callerCandidates: [],
          calleeCandidates: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          expiresAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000), // 1h TTL
        },
        { merge: true }
      );

      const unsub = onSnapshot(signalDocRef, async (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        if (data.answer && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (Array.isArray(data.calleeCandidates) && data.calleeCandidates.length > 0) {
          for (const c of data.calleeCandidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch {}
          }
        }
      });
      this.unsubscribers.set(peerUid, unsub);
    } else {
      let hasAnswered = false;
      const unsub = onSnapshot(signalDocRef, async (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        if (data.offer && !pc.currentRemoteDescription && !hasAnswered) {
          hasAnswered = true;
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await updateDoc(signalDocRef, {
            answer: { type: answer.type, sdp: answer.sdp },
            updatedAt: serverTimestamp(),
          });
        }

        if (Array.isArray(data.callerCandidates) && data.callerCandidates.length > 0) {
          for (const c of data.callerCandidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch {}
          }
        }
      });
      this.unsubscribers.set(peerUid, unsub);
    }
  }

  /**
   * Client-side moderation: mute/unmute a specific remote peer for the local user.
   */
  setPeerLocallyMuted(peerUid, mute) {
    if (mute) {
      this.locallyMutedPeers.add(peerUid);
    } else {
      this.locallyMutedPeers.delete(peerUid);
    }
    const audioEl = this.audioElements.get(peerUid);
    if (audioEl) {
      audioEl.muted = mute || this.isDeafened;
    }
  }

  isPeerLocallyMuted(peerUid) {
    return this.locallyMutedPeers.has(peerUid);
  }

  /**
   * Mic Mute Toggle
   */
  setLocalMuted(muted) {
    this.isMuted = muted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }

  /**
   * Deafen Toggle (mutes incoming audio from all peers AND mutes local mic)
   */
  setDeafened(deafened) {
    this.isDeafened = deafened;
    if (deafened) {
      this.setLocalMuted(true);
    }
    this.audioElements.forEach((audioEl, peerUid) => {
      audioEl.muted = deafened || this.locallyMutedPeers.has(peerUid);
    });
  }

  disconnectPeer(peerUid) {
    const unsub = this.unsubscribers.get(peerUid);
    if (unsub) {
      unsub();
      this.unsubscribers.delete(peerUid);
    }

    const buffer = this.candidateBuffers.get(peerUid);
    if (buffer) {
      buffer.destroy();
      this.candidateBuffers.delete(peerUid);
    }

    const pc = this.peerConnections.get(peerUid);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerUid);
    }

    const audioEl = this.audioElements.get(peerUid);
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      this.audioElements.delete(peerUid);
    }

    this.analysers.delete(peerUid);
    this.speakingStates.delete(peerUid);
    this.onSpeakingChange(peerUid, false);
    this.onConnectionStateChange(peerUid, 'closed', 'closed');
    this.onPeerLeft(peerUid);
  }

  destroy() {
    if (this.meterInterval) {
      clearInterval(this.meterInterval);
      this.meterInterval = null;
    }

    this.peerConnections.forEach((_, peerUid) => {
      this.disconnectPeer(peerUid);
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }
  }
}
