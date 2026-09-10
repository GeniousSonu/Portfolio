'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import styles from '@/app/lounge/lounge.module.css';

// Dynamically import EmojiPicker to keep initial bundle light
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem', color: '#94a3b8' }}>Loading Emojis...</div>,
});

const STATIC_STICKERS = [
  { id: 'cyber-rocket', name: 'Rocket', src: '/stickers/cyber-rocket.svg' },
  { id: 'fire-vibe', name: 'Fire', src: '/stickers/fire-vibe.svg' },
  { id: 'party-popper', name: 'Party', src: '/stickers/party-popper.svg' },
  { id: 'cool-sunglasses', name: 'Cool', src: '/stickers/cool-sunglasses.svg' },
  { id: 'dj-headphones', name: 'DJ', src: '/stickers/dj-headphones.svg' },
  { id: 'glowing-heart', name: 'Heart', src: '/stickers/glowing-heart.svg' },
];

export default function LoungeChat({
  roomId,
  currentUser,
  displayName,
  participants,
  isOpen,
  onClose,
  onNewMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerTray, setShowStickerTray] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastTypingWriteRef = useRef(0);
  const chatDrawerRef = useRef(null);
  const inputRef = useRef(null);

  const isFirstSnapshotRef = useRef(true);
  const onNewMessageRef = useRef(onNewMessage);
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key handling inside chat drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showEmojiPicker || showStickerTray) {
          setShowEmojiPicker(false);
          setShowStickerTray(false);
        } else {
          inputRef.current?.blur();
          onClose?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showEmojiPicker, showStickerTray, onClose]);

  // Close popovers if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (chatDrawerRef.current && !chatDrawerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
        setShowStickerTray(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  // Subscribe to room messages (last 60 messages)
  useEffect(() => {
    if (!roomId || !currentUser) return;
    isFirstSnapshotRef.current = true;

    const messagesCol = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'), limit(60));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            ...data,
          });
        });

        setMessages(msgs);

        // Don't fire unread badge notifications on the initial load of existing history
        if (isFirstSnapshotRef.current) {
          isFirstSnapshotRef.current = false;
          return;
        }

        if (!isOpen && snapshot.docChanges().some((change) => change.type === 'added')) {
          onNewMessageRef.current?.();
        }
      },
      (err) => {
        console.warn('[The Lounge] Chat snapshot notice:', err);
      }
    );

    return () => unsubscribe();
  }, [roomId, currentUser, isOpen]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Throttled typing indicator write
  const handleTyping = useCallback(() => {
    if (!currentUser || !roomId) return;
    const now = Date.now();

    // Throttle Firestore write to once every 2.5 seconds
    if (now - lastTypingWriteRef.current > 2500) {
      lastTypingWriteRef.current = now;
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, { isTyping: true }).catch(() => {});
    }

    // Reset typing after 3 seconds of silence
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, { isTyping: false }).catch(() => {});
    }, 3000);
  }, [currentUser, roomId]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const clean = inputText.trim().slice(0, 1000);
    if (!clean || isSending || !currentUser) return;

    setIsSending(true);
    setInputText('');
    setShowEmojiPicker(false);
    setShowStickerTray(false);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
    updateDoc(pRef, { isTyping: false }).catch(() => {});

    try {
      const messagesCol = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesCol, {
        uid: currentUser.uid,
        displayName: displayName || 'Anonymous Guest',
        type: 'text',
        text: clean,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000), // 24h TTL
      });
    } catch (err) {
      console.error('[The Lounge] Message send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSticker = async (stickerId) => {
    if (!currentUser || isSending) return;
    const valid = STATIC_STICKERS.find((s) => s.id === stickerId);
    if (!valid) return;

    setIsSending(true);
    setShowStickerTray(false);
    setShowEmojiPicker(false);

    try {
      const messagesCol = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesCol, {
        uid: currentUser.uid,
        displayName: displayName || 'Anonymous Guest',
        type: 'sticker',
        stickerId: valid.id,
        text: `[Sticker: ${valid.name}]`,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000), // 24h TTL
      });
    } catch (err) {
      console.error('[The Lounge] Sticker send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    if (!emojiData?.emoji) return;
    setInputText((prev) => (prev + emojiData.emoji).slice(0, 1000));
  };

  // Find other participants who are currently typing
  const typingUsers = (participants || []).filter(
    (p) => p.uid !== currentUser?.uid && p.isTyping && p.isOnline
  );

  return (
    <aside
      ref={chatDrawerRef}
      className={`${styles.chatDrawer} ${isOpen ? styles.chatDrawerOpen : ''}`}
      aria-label="Lounge Chat"
    >
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>
          <span>◈</span>
          <span>STAGE CHAT</span>
        </div>
        <button
          type="button"
          onClick={() => {
            inputRef.current?.blur();
            onClose?.();
          }}
          className={styles.chatCloseBtn}
          aria-label="Close Chat"
        >
          ✕
        </button>
      </div>

      <div className={styles.chatMessagesList}>
        {messages.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem', fontSize: '0.78rem' }}>
            No messages yet. Send a transmission to the room!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.uid === currentUser?.uid;
            const timeStr = msg.createdAt?.toDate
              ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--';

            return (
              <div
                key={msg.id}
                className={`${styles.chatMessageItem} ${
                  isMe ? styles.chatMessageItemMe : styles.chatMessageItemOther
                }`}
              >
                <div className={styles.chatSenderRow}>
                  <span className={styles.chatSenderName} style={{ color: isMe ? '#34d399' : '#60a5fa' }}>
                    {msg.displayName} {isMe && '(you)'}
                  </span>
                  <span className={styles.chatTime}>{timeStr}</span>
                </div>

                {/* Render Sticker or Plain Text */}
                {msg.type === 'sticker' && msg.stickerId ? (
                  <div className={styles.stickerMessageWrap}>
                    <img
                      src={`/stickers/${msg.stickerId}.svg`}
                      alt={msg.text || 'Sticker'}
                      width={72}
                      height={72}
                      className={styles.stickerImg}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={styles.chatText}>{msg.text}</div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.typingStatus}>
        {typingUsers.length > 0 && (
          <span>
            {typingUsers.map((u) => u.displayName).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        )}
      </div>

      <form onSubmit={handleSendMessage} className={styles.chatInputForm} style={{ position: 'relative' }}>
        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className={styles.emojiPickerPopover}>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              searchPlaceHolder="Search emojis..."
              width={300}
              height={360}
            />
          </div>
        )}

        {/* Static Stickers Popover */}
        {showStickerTray && (
          <div className={styles.stickerTrayPopover}>
            <div className={styles.stickerTrayHeader}>
              <span>Curated Stickers</span>
              <button
                type="button"
                onClick={() => setShowStickerTray(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                ✕
              </button>
            </div>
            <div className={styles.stickerTrayGrid}>
              {STATIC_STICKERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSendSticker(s.id)}
                  className={styles.stickerTrayItem}
                  title={`Send ${s.name} sticker`}
                >
                  <img src={s.src} alt={s.name} width={44} height={44} className={styles.stickerTrayImg} />
                  <span className={styles.stickerTrayName}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.chatInputRow}>
          {/* Emoji Toggle Button */}
          <button
            type="button"
            className={`${styles.chatMediaBtn} ${showEmojiPicker ? styles.chatMediaBtnActive : ''}`}
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
              setShowStickerTray(false);
            }}
            title="Add emoji"
            aria-label="Toggle emoji picker"
          >
            😊
          </button>

          {/* Sticker Tray Toggle Button */}
          <button
            type="button"
            className={`${styles.chatMediaBtn} ${showStickerTray ? styles.chatMediaBtnActive : ''}`}
            onClick={() => {
              setShowStickerTray((prev) => !prev);
              setShowEmojiPicker(false);
            }}
            title="Send sticker"
            aria-label="Toggle sticker tray"
          >
            🏷️
          </button>

          <input
            ref={inputRef}
            type="text"
            className={styles.chatInputField}
            placeholder="Type a message... (max 1000)"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleTyping();
            }}
            maxLength={1000}
            disabled={!currentUser}
          />
          <button
            type="submit"
            className={styles.chatSendBtn}
            disabled={isSending || !inputText.trim()}
          >
            Send
          </button>
        </div>
        <div className={styles.charLimit}>{inputText.length} / 1000</div>
      </form>
    </aside>
  );
}

