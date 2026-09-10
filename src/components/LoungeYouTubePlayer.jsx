'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import styles from '@/app/lounge/lounge.module.css';

export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

export default function LoungeYouTubePlayer({
  roomId,
  isHost,
  playbackState,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [apiReady, setApiReady] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const isSyncingFromHostRef = useRef(false);
  const lastBroadcastRef = useRef(0);

  // 1. Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Broadcast host playback state to Firestore
  const broadcastPlaybackState = useCallback(
    async (isPlaying, positionSeconds) => {
      if (!isHost || !roomId || !playbackState?.videoId) return;

      const now = Date.now();
      if (now - lastBroadcastRef.current < 800) return; // Throttle broadcasts
      lastBroadcastRef.current = now;

      try {
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, {
          'playbackState.isPlaying': isPlaying,
          'playbackState.positionSeconds': Math.round(positionSeconds * 10) / 10,
          'playbackState.updatedAt': serverTimestamp(),
        });
      } catch (err) {
        console.warn('[The Lounge] YouTube sync broadcast notice:', err);
      }
    },
    [isHost, roomId, playbackState?.videoId]
  );

  // 2. Initialize YouTube Player once API is ready and videoId exists
  useEffect(() => {
    if (!apiReady || !containerRef.current || !playbackState?.videoId) return;

    const videoId = playbackState.videoId;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: playbackState.isPlaying ? 1 : 0,
          controls: isHost ? 1 : 0, // Only host has native control over playback
          disablekb: isHost ? 0 : 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            if (playbackState.isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (!isHost || isSyncingFromHostRef.current) return;

            // Host state changed
            if (event.data === window.YT.PlayerState.PLAYING) {
              broadcastPlaybackState(true, event.target.getCurrentTime());
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              broadcastPlaybackState(false, event.target.getCurrentTime());
            }
          },
        },
      });
    } else {
      // Player already exists: check if videoId changed
      const currentUrl = playerRef.current.getVideoUrl?.() || '';
      if (!currentUrl.includes(videoId)) {
        playerRef.current.loadVideoById(videoId);
      }
    }
  }, [apiReady, playbackState?.videoId, isHost, broadcastPlaybackState]);

  // 3. Guest Sync Loop (Mirrors Host with 2-Second Drift Tolerance)
  useEffect(() => {
    if (isHost || !playerRef.current || !playerRef.current.getPlayerState) return;
    if (!playbackState || !playbackState.videoId) return;

    isSyncingFromHostRef.current = true;

    try {
      const now = Date.now();
      const updatedMs = playbackState.updatedAt?.toMillis ? playbackState.updatedAt.toMillis() : now;
      const elapsedSec = (now - updatedMs) / 1000;
      const expectedTime = playbackState.isPlaying
        ? playbackState.positionSeconds + elapsedSec
        : playbackState.positionSeconds;

      const guestCurrentTime = playerRef.current.getCurrentTime?.() || 0;
      const drift = Math.abs(expectedTime - guestCurrentTime);

      // Only seek if drift exceeds tolerance threshold of 2.0s to avoid micro-jitter
      if (drift > 2.0) {
        playerRef.current.seekTo(expectedTime, true);
      }

      // Sync play/pause state
      const playerState = playerRef.current.getPlayerState?.();
      if (playbackState.isPlaying && playerState !== window.YT?.PlayerState?.PLAYING) {
        playerRef.current.playVideo();
      } else if (!playbackState.isPlaying && playerState === window.YT?.PlayerState?.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch {}

    const timer = setTimeout(() => {
      isSyncingFromHostRef.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [playbackState, isHost]);

  // Handle Host loading new video
  const handleLoadVideo = async (e) => {
    e.preventDefault();
    setInputError('');

    const id = extractYouTubeId(videoInput);
    if (!id) {
      setInputError('Please enter a valid YouTube video URL or 11-character video ID.');
      return;
    }

    setIsLoadingVideo(true);
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        playbackState: {
          videoId: id,
          isPlaying: true,
          positionSeconds: 0,
          updatedAt: serverTimestamp(),
        },
      });
      setVideoInput('');
    } catch (err) {
      setInputError(err.message || 'Failed to update video.');
    } finally {
      setIsLoadingVideo(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Player Frame Container */}
      <div style={{ flex: 1, width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      </div>

      {/* Host Stream Controls Bar */}
      {isHost && (
        <div
          style={{
            background: 'rgba(11, 14, 20, 0.95)',
            borderTop: '1px solid rgba(42, 47, 56, 0.8)',
            padding: '0.65rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          <form onSubmit={handleLoadVideo} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className={styles.chatInputField}
              placeholder="Paste YouTube URL or ID to broadcast..."
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              disabled={isLoadingVideo}
            />
            <button
              type="submit"
              className={styles.primaryBtn}
              style={{ padding: '0 1rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              disabled={isLoadingVideo || !videoInput.trim()}
            >
              {isLoadingVideo ? 'Loading...' : 'Queue Video'}
            </button>
          </form>
          {inputError && <span style={{ color: '#f87171', fontSize: '0.72rem' }}>⚠ {inputError}</span>}
        </div>
      )}

      {/* Public YouTube Embed Notice */}
      <div
        style={{
          fontSize: '0.66rem',
          color: '#64748b',
          textAlign: 'center',
          padding: '0.35rem',
          background: '#07090e',
          fontFamily: 'var(--font-mono, monospace)',
          borderTop: '1px solid rgba(42, 47, 56, 0.5)',
        }}
      >
        Watch &amp; listen together using publicly available YouTube embeds · Peer synchronized
      </div>
    </div>
  );
}
