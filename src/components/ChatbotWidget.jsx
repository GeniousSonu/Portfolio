'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './ChatbotWidget.module.css';
import useScrollLock from '../hooks/useScrollLock';
import { supabase } from '@/lib/supabaseClient';

const MAX_CHAR_COUNT = 500;
const SESSION_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

const INITIAL_AI_MESSAGE = {
  id: 'ai-init-0',
  role: 'model',
  sender: 'ai',
  text: "Hey! I'm genious.exe, Sahinur's portfolio systems assistant. Ask me anything about his engineering career, tech stack, IoT vaccine patent, projects, favorite books, or hobbies.",
  time: '',
};

const SUGGESTIONS = [
  'What tech stack do you specialize in?',
  'Tell me about your IoT patent',
  'Show me your featured projects',
  'Where can I find your LinkedIn & GitHub?',
];

function formatTime(isoString) {
  const d = isoString ? new Date(isoString) : new Date();
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getSonuLocalTime() {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Web Audio API synthesize chime.
 * Triggers a subtle, short 2-tone melodic notification chime when a reply
 * arrives while widget is minimized or tab is in background.
 */
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.09, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.08);
    gain2.gain.setValueAtTime(0.1, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.28);
  } catch (e) {
    // Non-blocking catch for autoplay audio restrictions
  }
}

/**
 * Action token parser:
 * Recognizes [action:nav:TARGET|LABEL] and [action:open:URL|LABEL].
 * Strips tokens from clean display text and returns parsed actions array.
 */
function parseMessageActions(rawText) {
  if (typeof rawText !== 'string') return { cleanText: '', actions: [] };

  const actionRegex = /\[action:(nav|open):([^|\]]+)\|([^\]]+)\]/g;
  const actions = [];
  let match;
  while ((match = actionRegex.exec(rawText)) !== null) {
    actions.push({
      type: match[1], // 'nav' or 'open'
      target: match[2].trim(),
      label: match[3].trim(),
    });
  }

  const cleanText = rawText.replace(actionRegex, '').trim();
  return { cleanText, actions };
}

/**
 * XSS-Safe text renderer.
 * Splits on newlines and renders pure React text nodes with line breaks.
 * Strictly never invokes dangerouslySetInnerHTML.
 */
function SafeMessageContent({ content }) {
  if (typeof content !== 'string') return null;

  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const router = useRouter();

  // Mode: 'ai' (AI Assistant) vs 'live' (Talk to Sonu via Telegram relay)
  const [chatMode, setChatMode] = useState('ai');

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // Independent conversation state per mode
  const [aiMessages, setAiMessages] = useState([INITIAL_AI_MESSAGE]);
  const [liveMessages, setLiveMessages] = useState([]);

  // Visitor name state for Live mode (persisted across session in sessionStorage)
  const [visitorName, setVisitorName] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('live_chat_visitor_name') || '';
    }
    return '';
  });
  const [nameInput, setNameInput] = useState('');
  const [hasStartedLiveChat, setHasStartedLiveChat] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('live_chat_visitor_name'));
    }
    return false;
  });

  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLiveSending, setIsLiveSending] = useState(false);
  const [isWaitingForSonu, setIsWaitingForSonu] = useState(false);
  const [hasShownWaitingNotice, setHasShownWaitingNotice] = useState(false);
  const [hasUnreadLiveReply, setHasUnreadLiveReply] = useState(false);
  const [unreadLiveCount, setUnreadLiveCount] = useState(0);
  const [hasInteractedAi, setHasInteractedAi] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isEndingChat, setIsEndingChat] = useState(false);

  // Time & Offline Suggestion states
  const [sonuTime, setSonuTime] = useState(getSonuLocalTime);
  const [lastVisitorMessageTime, setLastVisitorMessageTime] = useState(null);
  const [showOfflineSuggestion, setShowOfflineSuggestion] = useState(false);

  const sessionIdRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatPanelRef = useRef(null);

  // Synchronization refs for callbacks and debouncing
  const isOpenRef = useRef(isOpen);
  const chatModeRef = useRef(chatMode);
  const isSendingRef = useRef(false);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  // Keep Sonu local time updated
  useEffect(() => {
    const timer = setInterval(() => {
      setSonuTime(getSonuLocalTime());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Cross-device body scroll lock whenever the chatbot is open
  useScrollLock(isOpen);

  // Generate high-entropy unguessable session ID using crypto.randomUUID()
  const getOrCreateSessionId = () => {
    if (!sessionIdRef.current) {
      sessionIdRef.current =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStartTimeRef.current = Date.now();
      setIsSessionExpired(false);
    }
    return sessionIdRef.current;
  };

  // Full reset of live chat state
  const resetLiveChatSession = () => {
    setLiveMessages([]);
    setIsWaitingForSonu(false);
    setHasShownWaitingNotice(false);
    setIsSessionExpired(false);
    setIsEndingChat(false);
    setShowOfflineSuggestion(false);
    sessionIdRef.current =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStartTimeRef.current = Date.now();
  };

  // Welcome back message when visitor name exists from previous session visit
  useEffect(() => {
    if (hasStartedLiveChat && visitorName && liveMessages.length === 0) {
      setLiveMessages([
        {
          id: 'welcome-0',
          role: 'model',
          sender: 'sonu',
          text: `Welcome back, ${visitorName}! Your messages forward directly to me. Type below to chat with me!`,
          time: formatTime(),
        },
      ]);
    }
  }, [hasStartedLiveChat, visitorName, liveMessages.length]);

  // Offline detection: 3 minutes after visitor's message without a reply from Sonu
  useEffect(() => {
    if (!isWaitingForSonu || !lastVisitorMessageTime) {
      setShowOfflineSuggestion(false);
      return;
    }

    const checkOffline = () => {
      const elapsed = Date.now() - lastVisitorMessageTime;
      if (elapsed >= 180000) { // 3 minutes
        setShowOfflineSuggestion(true);
      }
    };

    checkOffline();
    const interval = setInterval(checkOffline, 10000);
    return () => clearInterval(interval);
  }, [isWaitingForSonu, lastVisitorMessageTime]);

  // Subscribe to Supabase Realtime channel when active or open
  useEffect(() => {
    // Only subscribe once visitor has initiated live chat or has widget open
    if (!isOpen && !hasStartedLiveChat) return;

    const sid = getOrCreateSessionId();
    const channelName = `live-chat:${sid}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { ack: true } },
    });

    channel
      .on('broadcast', { event: 'sonu_reply' }, ({ payload }) => {
        if (payload?.text) {
          const replyMsg = {
            id: payload.id || `reply-${Date.now()}`,
            role: 'model',
            sender: 'sonu',
            text: payload.text,
            time: formatTime(payload.timestamp),
          };

          setLiveMessages((prev) => [...prev, replyMsg]);
          setIsWaitingForSonu(false);
          setShowOfflineSuggestion(false);

          // If widget is minimized/closed: increment unread count & chime
          if (!isOpenRef.current) {
            setUnreadLiveCount((c) => c + 1);
            playNotificationChime();
          } else if (chatModeRef.current !== 'live') {
            setHasUnreadLiveReply(true);
            playNotificationChime();
          } else if (typeof document !== 'undefined' && document.hidden) {
            // Tab is in the background
            playNotificationChime();
          }
        }
      })
      .on('broadcast', { event: 'session_ended' }, () => {
        // Two-way cleanup: Telegram inline button or server triggered session end
        resetLiveChatSession();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, hasStartedLiveChat]);

  // Periodic check for 6-hour session expiration
  useEffect(() => {
    if (!isOpen) return;
    const checkExpiry = () => {
      if (sessionStartTimeRef.current) {
        const elapsed = Date.now() - sessionStartTimeRef.current;
        if (elapsed > SESSION_EXPIRY_MS) {
          setIsSessionExpired(true);
        }
      }
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Pause floating animations when browser tab is hidden to save mobile battery/CPU
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const [isTriggerVisible, setIsTriggerVisible] = useState(false);

  // Show chatbot bubble after delay or scroll
  useEffect(() => {
    let triggered = false;
    const triggerAppearance = () => {
      if (triggered) return;
      triggered = true;
      setIsTriggerVisible(true);
      window.removeEventListener('scroll', handleScroll);
    };

    const timer = setTimeout(triggerAppearance, 8500);

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight > 0 && scrollY / scrollableHeight >= 0.25) {
        triggerAppearance();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // One-time attention pulse on first site visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem('genious_bot_intro_seen');
      if (!seen) {
        setIsFirstVisit(true);
        localStorage.setItem('genious_bot_intro_seen', 'true');
        const timer = setTimeout(() => setIsFirstVisit(false), 4500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(false);

  // Mobile nav synchronization
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body.classList.contains('mobile-nav-active')) {
      setIsNavOpen(true);
    }

    const handleNavToggle = (e) => {
      const navOpen = Boolean(e?.detail?.open);
      setIsNavOpen(navOpen);
      if (navOpen) {
        setIsOpen(false);
        setIsClosing(false);
      }
    };

    window.addEventListener('mobile-nav-toggle', handleNavToggle);
    return () => window.removeEventListener('mobile-nav-toggle', handleNavToggle);
  }, []);

  // Smooth auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeMessages = chatMode === 'ai' ? aiMessages : liveMessages;

  useEffect(() => {
    if (isOpen && !isClosing && (chatMode === 'ai' || hasStartedLiveChat)) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing, activeMessages, chatMode, hasStartedLiveChat]);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
    setUnreadLiveCount(0);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleActionClick = (action) => {
    if (action.type === 'nav') {
      const target = action.target;
      if (target.startsWith('#')) {
        if (pathname !== '/') {
          router.push(`/${target}`);
        } else {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(target);
      }
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        handleClose();
      }
    } else if (action.type === 'open') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  // Visitor starts live chat after entering name
  const handleStartLiveChat = (e) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (!cleanName) return;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('live_chat_visitor_name', cleanName);
    }
    setVisitorName(cleanName);
    setHasStartedLiveChat(true);

    const welcomeMsg = {
      id: 'welcome-0',
      role: 'model',
      sender: 'sonu',
      text: `Hey ${cleanName}! I'm Sonu. Your messages forward directly to my phone. Type below and I'll reply as soon as I see it!`,
      time: formatTime(),
    };
    setLiveMessages([welcomeMsg]);
  };

  // Site-side "End Chat" flow
  const handleEndChat = async () => {
    if (isEndingChat) return;
    setIsEndingChat(true);
    const sid = sessionIdRef.current;

    try {
      if (sid) {
        await fetch('/api/live-chat/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid }),
        });
      }
    } catch (err) {
      console.warn('[LiveChat] Notice during end chat request:', err);
    } finally {
      resetLiveChatSession();
    }
  };

  const handleSendMessage = async (textToSend, retryMsgId = null) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    if (chatMode === 'ai' && isAiLoading) return;
    if (chatMode === 'live' && isLiveSending) return;
    if (isSendingRef.current) return;

    if (query.length > MAX_CHAR_COUNT) {
      alert(`Message cannot exceed ${MAX_CHAR_COUNT} characters.`);
      return;
    }

    isSendingRef.current = true;
    if (!retryMsgId) {
      setInputValue('');
    }

    const msgId = retryMsgId || `user-${Date.now()}`;
    const userMessage = {
      id: msgId,
      role: 'user',
      text: query,
      time: formatTime(),
      status: 'sending',
    };

    if (chatMode === 'ai') {
      setHasInteractedAi(true);
      const updatedMessages = [...aiMessages, userMessage];
      setAiMessages(updatedMessages);
      setIsAiLoading(true);

      try {
        const conversationPayload = updatedMessages
          .slice(1, -1)
          .slice(-6)
          .map((m) => ({ role: m.role, text: m.text }));

        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            conversation: conversationPayload,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.reply || data?.error || 'Failed to get response');
        }

        const botMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          sender: 'ai',
          text: data.reply || "I couldn't process that. Please try asking again!",
          time: formatTime(),
        };
        setAiMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'model',
          sender: 'ai',
          text:
            err.message ||
            "I'm experiencing a temporary connection issue. Please try again or reach out through the contact form!",
          time: formatTime(),
        };
        setAiMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsAiLoading(false);
        isSendingRef.current = false;
      }
    } else {
      // ── "Talk to Sonu" Mode ──
      if (isSessionExpired) {
        sessionIdRef.current =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        sessionStartTimeRef.current = Date.now();
        setIsSessionExpired(false);
      }

      const sid = getOrCreateSessionId();

      if (retryMsgId) {
        setLiveMessages((prev) =>
          prev.map((m) => (m.id === retryMsgId ? { ...m, status: 'sending', time: formatTime() } : m))
        );
      } else {
        setLiveMessages((prev) => [...prev, userMessage]);
      }

      setIsLiveSending(true);

      // Only show the waiting notice ONCE on the very first message of the session
      if (!hasShownWaitingNotice) {
        setIsWaitingForSonu(true);
        setHasShownWaitingNotice(true);
      }

      setLastVisitorMessageTime(Date.now());
      setShowOfflineSuggestion(false);

      const effectiveName =
        visitorName ||
        (typeof window !== 'undefined' ? sessionStorage.getItem('live_chat_visitor_name') : '') ||
        'Visitor';

      try {
        const res = await fetch('/api/live-chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sid,
            message: query,
            visitorName: effectiveName,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to deliver message to Sonu');
        }

        // Mark message as delivered
        setLiveMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: 'delivered' } : m))
        );
      } catch (err) {
        console.error('[LiveChat] Send error:', err);
        // Mark message as failed with retry action
        setLiveMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: 'failed' } : m))
        );
      } finally {
        setIsLiveSending(false);
        isSendingRef.current = false;
      }
    }
  };

  const handleRetryMessage = (failedId, text) => {
    handleSendMessage(text, failedId);
  };

  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHAR_COUNT);
    setInputValue(val);

    // Throttled typing notification to Telegram
    if (chatMode === 'live' && hasStartedLiveChat) {
      const now = Date.now();
      if (now - lastTypingSentRef.current > 4000) {
        lastTypingSentRef.current = now;
        fetch('/api/live-chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: getOrCreateSessionId() }),
        }).catch(() => {});
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleClearChat = () => {
    if (chatMode === 'ai') {
      setAiMessages([INITIAL_AI_MESSAGE]);
      setHasInteractedAi(false);
    } else {
      handleEndChat();
    }
  };

  const remainingChars = MAX_CHAR_COUNT - inputValue.length;
  const isNearLimit = remainingChars < 50;

  // Exclude widget from Sanity Studio routes or when mobile nav is open
  if (pathname?.startsWith('/studio') || isNavOpen) {
    return null;
  }

  const isCurrentLoading = chatMode === 'ai' ? isAiLoading : isLiveSending;
  const shortVisitorName = visitorName.split(' ')[0] || visitorName;

  return (
    <div className={styles.widgetWrapper}>
      {/* Floating Trigger Button */}
      {!isOpen && isTriggerVisible && (
        <div className={`${styles.triggerWrapper} ${isFirstVisit ? styles.firstVisitAttention : ''}`}>
          <button
            type="button"
            className={styles.triggerBtn}
            onClick={handleOpen}
            aria-expanded={isOpen}
            aria-label="Open chat assistant"
            title="Ask me anything or chat live with Sonu"
          >
            {unreadLiveCount > 0 && (
              <span className={styles.unreadCountBadge} title={`${unreadLiveCount} unread message(s)`}>
                {unreadLiveCount}
              </span>
            )}
            <div className={styles.botFigureWrap} aria-hidden="true">
              <div
                className={styles.botBobbingFigure}
                style={{ animationPlayState: isTabVisible ? 'running' : 'paused' }}
              >
                <img
                  src="/Image/bot.svg"
                  alt=""
                  width={34}
                  height={34}
                  className={styles.botAvatarImg}
                  loading="eager"
                />
              </div>
              <div
                className={styles.botShadow}
                style={{ animationPlayState: isTabVisible ? 'running' : 'paused' }}
                aria-hidden="true"
              />
              <span className={styles.pulseDot} aria-hidden="true" />
            </div>

            <span className={styles.triggerText}>Chat with me</span>
          </button>
        </div>
      )}

      {/* Expandable Chat Panel & Backdrop */}
      {isOpen && (
        <>
          <div
            className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            ref={chatPanelRef}
            className={`${styles.chatPanel} ${isClosing ? styles.chatPanelClosing : ''}`}
            role="dialog"
            aria-label={chatMode === 'ai' ? 'genious.exe Systems Assistant' : 'Live Chat with Sonu'}
            aria-modal="true"
          >
            {/* Pinned Header */}
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.botHeaderAvatarWrap} aria-hidden="true">
                  <img
                    src="/Image/bot.svg"
                    alt=""
                    width={28}
                    height={28}
                    className={styles.headerAvatarImg}
                  />
                </div>
                <div className={styles.headerTitles}>
                  <h3>{chatMode === 'ai' ? 'genious.exe' : 'SK Sahinur Islam'}</h3>
                  <span>
                    {chatMode === 'ai'
                      ? '● Online · Systems Assistant'
                      : `🕐 ${sonuTime} for Sonu (IST) · Direct Line`}
                  </span>
                </div>
              </div>

              <div className={styles.headerActions}>
                {chatMode === 'live' && hasStartedLiveChat && (
                  <>
                    <span className={styles.chattingAsLabel}>
                      {shortVisitorName}
                    </span>
                    <button
                      type="button"
                      className={styles.endChatBtn}
                      onClick={handleEndChat}
                      disabled={isEndingChat}
                      title="End chat session"
                      aria-label="End chat"
                    >
                      🔴 End
                    </button>
                  </>
                )}

                {chatMode === 'ai' && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={handleClearChat}
                    title="Reset AI conversation"
                    aria-label="Reset conversation"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={handleClose}
                  title="Close chat panel (Esc)"
                  aria-label="Close chat panel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className={styles.modeTabsRow}>
              <button
                type="button"
                className={`${styles.modeTabBtn} ${chatMode === 'ai' ? styles.modeTabActiveAi : ''}`}
                onClick={() => setChatMode('ai')}
                aria-label="Switch to AI Assistant"
              >
                <span className={styles.tabIcon}>🤖</span>
                <span>AI Assistant</span>
              </button>
              <button
                type="button"
                className={`${styles.modeTabBtn} ${chatMode === 'live' ? styles.modeTabActiveLive : ''}`}
                onClick={() => {
                  setChatMode('live');
                  setHasUnreadLiveReply(false);
                }}
                aria-label="Switch to Talk to Sonu"
              >
                <span className={styles.tabIcon}>💬</span>
                <span>Talk to Sonu</span>
                {hasUnreadLiveReply && <span className={styles.unreadDot} title="New reply from Sonu" />}
              </button>
              <button
                type="button"
                className={styles.modeTabBtn}
                onClick={() => {
                  setIsOpen(false);
                  router.push('/space');
                }}
                aria-label="Navigate to Shared Space"
                title="Public Real-time Shared Clipboard"
              >
                <span className={styles.tabIcon}>📋</span>
                <span>Shared Space</span>
              </button>
            </div>

            {/* ─── Body Area ─── */}
            {chatMode === 'live' && !hasStartedLiveChat ? (
              /* Upfront Visitor Name Prompt Screen */
              <div className={styles.namePromptContainer}>
                <div className={styles.namePromptCard}>
                  <div className={styles.namePromptAvatar} aria-hidden="true">
                    💬
                  </div>
                  <h4 className={styles.namePromptTitle}>What should Sonu call you?</h4>
                  <p className={styles.namePromptDesc}>
                    Introduce yourself before starting a direct chat with Sonu.
                  </p>
                  <form onSubmit={handleStartLiveChat} className={styles.namePromptForm}>
                    <input
                      type="text"
                      className={styles.namePromptInput}
                      placeholder="Your name or handle..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value.slice(0, 30))}
                      maxLength={30}
                      autoFocus
                      required
                      aria-label="Your name"
                    />
                    <button
                      type="submit"
                      className={styles.startChatBtn}
                      disabled={!nameInput.trim()}
                    >
                      <span>Start Chat</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Conversation Messages List */
              <>
                <div className={styles.messagesList} role="log" aria-live="polite">
                  {chatMode === 'ai' ? (
                    /* AI Mode Messages */
                    aiMessages.map((msg) => {
                      const isUser = msg.role === 'user';
                      const { cleanText, actions } = parseMessageActions(msg.text);

                      return (
                        <div
                          key={msg.id}
                          className={`${styles.messageRow} ${isUser ? styles.userRow : styles.botRow}`}
                        >
                          <span className={styles.systemBadge}>
                            {isUser ? 'YOU' : 'GENIOUS.EXE'}
                          </span>
                          <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
                            <SafeMessageContent content={cleanText} />

                            {!isUser && actions.length > 0 && (
                              <div className={styles.actionButtonsRow}>
                                {actions.map((action, actIdx) => (
                                  <button
                                    key={actIdx}
                                    type="button"
                                    className={action.type === 'nav' ? styles.actionNavBtn : styles.actionOpenBtn}
                                    onClick={() => handleActionClick(action)}
                                    title={action.type === 'nav' ? `Navigate to ${action.target}` : `Open ${action.target} in new tab`}
                                  >
                                    {action.type === 'nav' ? (
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                      </svg>
                                    ) : (
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                      </svg>
                                    )}
                                    <span>{action.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Live Chat (WhatsApp Style) Messages */
                    <div className={styles.liveMessagesContainer}>
                      {liveMessages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        const prevMsg = liveMessages[idx - 1];
                        const isSameSenderAsPrev = prevMsg && prevMsg.role === msg.role;
                        const groupClass = isSameSenderAsPrev ? styles.groupSame : styles.groupDiff;

                        return (
                          <div
                            key={msg.id}
                            className={`${styles.liveMessageRow} ${
                              isUser ? styles.liveUserRow : styles.liveSonuRow
                            } ${groupClass}`}
                          >
                            <div
                              className={`${styles.bubble} ${
                                isUser ? styles.liveUserBubble : styles.liveSonuBubble
                              }`}
                            >
                              <div className={styles.bubbleContentWrap}>
                                <SafeMessageContent content={msg.text} />
                                <div className={styles.bubbleMetaRow}>
                                  <span className={styles.bubbleTimeText}>
                                    {msg.time || formatTime()}
                                  </span>
                                  {isUser && (
                                    <>
                                      {msg.status === 'sending' && (
                                        <span className={styles.bubbleSending} title="Sending message...">
                                          ⋯
                                        </span>
                                      )}
                                      {(!msg.status || msg.status === 'delivered') && (
                                        <span className={styles.bubbleTick} title="Delivered to Sonu">
                                          ✓✓
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                                {isUser && msg.status === 'failed' && (
                                  <div className={styles.failedStatusRow}>
                                    <span className={styles.failedStatusText}>Message failed</span>
                                    <button
                                      type="button"
                                      className={styles.retryBtn}
                                      onClick={() => handleRetryMessage(msg.id, msg.text)}
                                      title="Retry sending message to Sonu"
                                    >
                                      Retry ↻
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Suggestions on initial AI state */}
                  {chatMode === 'ai' && !hasInteractedAi && aiMessages.length === 1 && (
                    <div className={styles.suggestions}>
                      {SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={styles.chipBtn}
                          onClick={() => handleSendMessage(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Waiting Notice in Live Mode - only shown once per session */}
                  {chatMode === 'live' && isWaitingForSonu && (
                    <div className={styles.waitingNotice}>
                      <span className={styles.waitingNoticeIcon}>⏳</span>
                      <div>
                        <strong>Sent to Sonu · Waiting for reply...</strong>
                        <div>Sonu isn't always online 24/7 — he'll get back to you as soon as he can!</div>
                      </div>
                    </div>
                  )}

                  {/* Offline Inactivity Suggestion in Live Mode */}
                  {chatMode === 'live' && showOfflineSuggestion && (
                    <div className={styles.offlineSuggestionCard}>
                      <span className={styles.offlineIcon}>💡</span>
                      <div className={styles.offlineContent}>
                        <strong>Waiting for Sonu?</strong>
                        <p>Sonu might be away or coding. You can get instant answers right now from the AI assistant without losing your live chat place.</p>
                        <button
                          type="button"
                          className={styles.switchAiBtn}
                          onClick={() => setChatMode('ai')}
                        >
                          Try AI Assistant 🤖
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expired Session Notice in Live Mode */}
                  {chatMode === 'live' && isSessionExpired && (
                    <div className={styles.expiredNotice}>
                      <span className={styles.expiredNoticeIcon}>⚠️</span>
                      <div>
                        <strong>This conversation session has expired (6h limit).</strong>
                        <div>Send a new message below to start a fresh chat with Sonu.</div>
                      </div>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isCurrentLoading && (
                    <div className={`${styles.messageRow} ${chatMode === 'ai' ? styles.botRow : styles.liveSonuRow}`}>
                      <span className={styles.systemBadge}>
                        {chatMode === 'ai' ? 'GENIOUS.EXE THINKING' : 'DELIVERING MESSAGE'}
                      </span>
                      <div className={`${styles.bubble} ${chatMode === 'ai' ? styles.botBubble : styles.liveSonuBubble} ${styles.typingIndicator}`}>
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <div className={styles.footer}>
                  <form onSubmit={handleFormSubmit} className={styles.inputForm}>
                    {/* One-time Conversation Starter Chip for First-time Live Chat Visitors */}
                    {chatMode === 'live' && hasStartedLiveChat && liveMessages.filter((m) => m.role === 'user').length === 0 && (
                      <div className={styles.starterChipRow}>
                        <button
                          type="button"
                          className={styles.starterChipBtn}
                          onClick={() => handleSendMessage('What are you currently working on?')}
                        >
                          <span>💡 Try asking: &ldquo;What are you currently working on?&rdquo;</span>
                        </button>
                      </div>
                    )}
                    <div className={`${styles.inputRow} ${chatMode === 'live' ? styles.liveInputRow : ''}`}>
                      <input
                        ref={inputRef}
                        type="text"
                        className={styles.textInput}
                        placeholder={
                          chatMode === 'ai'
                            ? 'Ask genious.exe about Sahinur...'
                            : `Reply as ${shortVisitorName}...`
                        }
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={isCurrentLoading}
                        maxLength={MAX_CHAR_COUNT}
                        aria-label="Message input"
                      />
                      <button
                        type="submit"
                        className={`${styles.sendBtn} ${chatMode === 'live' ? styles.liveSendBtn : ''}`}
                        disabled={isCurrentLoading || !inputValue.trim()}
                        aria-label="Send message"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>

                    <div className={styles.metaRow}>
                      <span>
                        {chatMode === 'ai'
                          ? 'In-memory session only'
                          : `Direct conversation · ${shortVisitorName}`}
                      </span>
                      <span
                        className={
                          remainingChars <= 20
                            ? styles.charCountLimit
                            : isNearLimit
                            ? styles.charCountWarn
                            : ''
                        }
                      >
                        {inputValue.length}/{MAX_CHAR_COUNT}
                      </span>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
