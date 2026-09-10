'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastTypingWriteRef = useRef(0);

  // Subscribe to room messages (last 60 messages)
  useEffect(() => {
    if (!roomId) return;

    const messagesCol = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'), limit(60));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({
          id: docSnap.id,
          ...data,
        });
      });

      setMessages(msgs);

      if (!isOpen && snapshot.docChanges().some((change) => change.type === 'added')) {
        onNewMessage?.();
      }
    });

    return () => unsubscribe();
  }, [roomId, isOpen, onNewMessage]);

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
    e.preventDefault();
    const clean = inputText.trim().slice(0, 1000);
    if (!clean || isSending || !currentUser) return;

    setIsSending(true);
    setInputText('');

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
    updateDoc(pRef, { isTyping: false }).catch(() => {});

    try {
      const messagesCol = collection(db, 'rooms', roomId, 'messages');
      await addDoc(messagesCol, {
        uid: currentUser.uid,
        displayName: displayName || 'Anonymous Guest',
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

  // Find other participants who are currently typing
  const typingUsers = (participants || []).filter(
    (p) => p.uid !== currentUser?.uid && p.isTyping && p.isOnline
  );

  return (
    <aside
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
          onClick={onClose}
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
              <div key={msg.id} className={styles.chatMessageItem}>
                <div className={styles.chatSenderRow}>
                  <span className={styles.chatSenderName} style={{ color: isMe ? '#34d399' : '#60a5fa' }}>
                    {msg.displayName} {isMe && '(you)'}
                  </span>
                  <span className={styles.chatTime}>{timeStr}</span>
                </div>
                {/* Safe plain text rendering - zero HTML injection */}
                <div className={styles.chatText}>{msg.text}</div>
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

      <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
        <div className={styles.chatInputRow}>
          <input
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
