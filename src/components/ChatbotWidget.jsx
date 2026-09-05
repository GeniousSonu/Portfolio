'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './ChatbotWidget.module.css';
import useScrollLock from '../hooks/useScrollLock';

const MAX_CHAR_COUNT = 500;

const INITIAL_MESSAGE = {
  id: 'init-0',
  role: 'model',
  text: "Hey! I'm genious.exe, Sahinur's portfolio systems assistant. Ask me anything about his engineering career, tech stack, IoT vaccine patent, projects, favorite books, or hobbies.",
};

const SUGGESTIONS = [
  'What tech stack do you specialize in?',
  'Tell me about your IoT patent',
  'Show me your featured projects',
  'Where can I find your LinkedIn & GitHub?',
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatPanelRef = useRef(null);

  // Cross-device body scroll lock whenever the chatbot is open
  useScrollLock(isOpen);

  // Pause floating animations when browser tab is hidden to save mobile battery/CPU
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const [isTriggerVisible, setIsTriggerVisible] = useState(false);

  // PRIORITY 3: Show chatbot bubble after 8-10 second delay OR when scrolled past 25-30% of page
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
      if (scrollableHeight > 0 && (scrollY / scrollableHeight) >= 0.25) {
        triggerAppearance();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // One-time attention pulse on first site visit (recorded in localStorage)
  useEffect(() => {
    try {
      const seen = localStorage.getItem('genious_bot_intro_seen');
      if (!seen) {
        setIsFirstVisit(true);
        localStorage.setItem('genious_bot_intro_seen', 'true');
        const timer = setTimeout(() => setIsFirstVisit(false), 4500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Storage access protected / private browsing
    }
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(false);

  // Synchronize with mobile navigation: close chatbot and hide trigger bubble when mobile nav is open
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body.classList.contains('mobile-nav-active')) {
      setIsNavOpen(true);
    }

    const handleNavToggle = (e) => {
      const navOpen = Boolean(e?.detail?.open);
      setIsNavOpen(navOpen);
      if (navOpen) {
        // Close chatbot automatically if it was open when nav menu opened
        setIsOpen(false);
        setIsClosing(false);
      }
    };

    window.addEventListener('mobile-nav-toggle', handleNavToggle);
    return () => window.removeEventListener('mobile-nav-toggle', handleNavToggle);
  }, []);

  // Auto-scroll messages list to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isClosing) {
      scrollToBottom();
      // Auto-focus input on open
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing, messages]);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220); // Sync with CSS exit animation duration
  };

  // Handle keyboard navigation (Escape to close)
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
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        router.push(target);
      }
      // On mobile screens, minimize chat so the user immediately sees the navigated section
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        handleClose();
      }
    } else if (action.type === 'open') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    if (query.length > MAX_CHAR_COUNT) {
      alert(`Message cannot exceed ${MAX_CHAR_COUNT} characters.`);
      return;
    }

    setHasInteracted(true);
    setInputValue('');

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
    };

    // Update in-memory state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Send thread history (excluding the first greeting and keeping last 6)
      const conversationPayload = updatedMessages
        .slice(1, -1) // All prior turns except initial greeting and just-added message
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        text: data.reply || "I couldn't process that. Please try asking again!",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text:
          err.message ||
          "I'm experiencing a temporary connection issue. Please try again or reach out through the contact form!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setHasInteracted(false);
  };

  const remainingChars = MAX_CHAR_COUNT - inputValue.length;
  const isNearLimit = remainingChars < 50;

  // Exclude widget from Sanity Studio routes or when full-screen mobile nav is open
  if (pathname?.startsWith('/studio') || isNavOpen) {
    return null;
  }

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
            aria-label="Open AI systems assistant"
            title="Ask me anything about Sahinur"
          >
            {/* 3D Floating Bot Icon with synchronous drop shadow */}
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

            <span className={styles.triggerText}>Ask me anything</span>
          </button>
        </div>
      )}

      {/* Expandable Chat Panel & Backdrop */}
      {isOpen && (
        <>
          {/* Dimmed backdrop for click-outside dismissal */}
          <div
            className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ''}`}
            onClick={handleClose}
            aria-hidden="true"
          />

          <div
            ref={chatPanelRef}
            className={`${styles.chatPanel} ${isClosing ? styles.chatPanelClosing : ''}`}
            role="dialog"
            aria-label="genious.exe Systems Assistant"
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
                  <h3>genious.exe</h3>
                  <span>● Online · Systems Assistant</span>
                </div>
              </div>

              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={handleClearChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </button>
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

          {/* Messages List */}
          <div className={styles.messagesList} role="log" aria-live="polite">
            {messages.map((msg) => {
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
            })}

            {/* Quick Suggestions on initial state */}
            {!hasInteracted && messages.length === 1 && (
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

            {/* Typing indicator */}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <span className={styles.systemBadge}>GENIOUS.EXE THINKING</span>
                <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingIndicator}`}>
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
              <div className={styles.inputRow}>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.textInput}
                  placeholder="Ask genious.exe about Sahinur..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, MAX_CHAR_COUNT))}
                  disabled={isLoading}
                  maxLength={MAX_CHAR_COUNT}
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  className={styles.sendBtn}
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Send message"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <div className={styles.metaRow}>
                <span>In-memory session only</span>
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
        </div>
        </>
      )}
    </div>
  );
}
