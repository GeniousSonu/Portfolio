'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import ChapterHeader from '../ChapterHeader';
import Emoji3D from '../Emoji3D';
import { useTheme } from '../ThemeProvider';
import { useChapterReveal } from '../motion';
import { CONTACT_LINKS, LINKTREE_SOCIALS } from '@/components/Contact';

const INTRO =
  "Looking for a developer who understands both the frontend and what's running underneath it? Whether it's a web app, a system integration, or something that involves a Linux terminal and a network diagram — I'm here.";

export default function ContactV3() {
  const rootRef = useRef(null);
  const { theme } = useTheme();
  useChapterReveal(rootRef);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('sahinurislam520@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // fallback
    }
  };

  const formMountedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !turnstileSiteKey || !turnstileContainerRef.current) {
      return undefined;
    }

    setTurnstileToken(null);

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return false;
      if (turnstileWidgetId.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          // Widget was already removed by the provider.
        }
        turnstileWidgetId.current = null;
      }
      try {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: theme === 'dark' ? 'dark' : 'light',
          callback: (token) => setTurnstileToken(token),
        });
      } catch {
        turnstileWidgetId.current = null;
      }
      return true;
    };

    let interval;
    if (!renderWidget()) {
      interval = setInterval(() => {
        if (renderWidget()) clearInterval(interval);
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (typeof window !== 'undefined' && window.turnstile && turnstileWidgetId.current !== null) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          // Provider teardown is best-effort.
        }
        turnstileWidgetId.current = null;
      }
    };
  }, [turnstileSiteKey, theme]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedbackState('error');
      setFeedback('⚠ Please fill all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackState('pending');
    setFeedback('Sending message...');

    const elapsedMs = Date.now() - formMountedAt.current;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          confirm_subject_ref: honeypot,
          elapsedMs,
          turnstileToken,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON error responses keep the generic message below.
      }

      if (res.ok && data.success) {
        setFeedbackState('success');
        setFeedback('✓ Message delivered! I will get back to you soon.');
        setName('');
        setEmail('');
        setMessage('');
        setHoneypot('');
      } else {
        setFeedbackState('error');
        if (res.status === 400 && data.error) {
          setFeedback(`⚠ ${data.error}`);
        } else if (data.error) {
          setFeedback(`✕ ${data.error}`);
        } else {
          setFeedback('✕ Failed to send message. Please try again later.');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Contact form network or submission error:', error);
      }
      setFeedbackState('error');
      setFeedback('✕ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      if (typeof window !== 'undefined' && window.turnstile && turnstileWidgetId.current !== null) {
        try {
          window.turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken(null);
        } catch {
          // Reset is best-effort.
        }
      }
    }
  };

  const focusComposer = (event) => {
    event.preventDefault();
    const field = document.querySelector('#name-field') || document.querySelector('#msg-field');
    field?.focus();
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section
      id="contact"
      className="v3-chapter v3-contact"
      ref={rootRef}
      aria-labelledby="contact-title"
    >
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
        />
      ) : null}

      <div className="v3-shell">
        <ChapterHeader
          number="08"
          chapter="The Invitation"
          title={
            <>
              Let&apos;s build something <em>reliable</em>
            </>
          }
          subtitle="One form, one email, or a terminal session — whichever feels like home."
          emoji="envelope"
          id="contact-title"
          aside={<Emoji3D name="bulb" size={56} alt="" className="v3-head-emoji" />}
        />

        <div className="v3-contact-frosted-card" data-reveal>
          {/* Oversized Bold Email Row (design-reference.md) */}
          <div className="v3-contact-email-row">
            <span className="v3-contact-email-badge">INQUIRIES //</span>
            <a href="mailto:sahinurislamm2002@gmail.com" className="v3-contact-email-address">
              sahinurislamm2002@gmail.com
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="v3-brutal-copy-btn"
              aria-label="Copy email address"
            >
              {copiedEmail ? '✓ COPIED' : 'COPY 📋'}
            </button>
          </div>

          {/* Action Pills Row */}
          <div className="v3-contact-action-pills">
            <a
              href="https://linkedin.com/in/genioussonu"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-brutal-pill-link"
              data-v3-sound="confirm"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/GeniousSonu"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-brutal-pill-link"
              data-v3-sound="confirm"
            >
              GitHub ↗
            </a>
            <a
              href="https://t.me/genioussonu"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-brutal-pill-link"
              data-v3-sound="confirm"
            >
              Telegram ↗
            </a>
            <a
              href="https://twitter.com/genioussonu"
              target="_blank"
              rel="noopener noreferrer"
              className="v3-brutal-pill-link"
              data-v3-sound="confirm"
            >
              Twitter/X ↗
            </a>
            <Link
              href="/contact"
              className="v3-brutal-pill-link v3-brutal-pill-link--lime"
              data-v3-sound="confirm"
            >
              Direct Transmission ⚡
            </Link>
          </div>

          <div className="v3-contact-grid">
            <div className="v3-contact-left">
              <p className="v3-contact-lede">{INTRO}</p>

              <Link href="/contact" className="v3-terminal-link" data-v3-sound="confirm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
                </svg>{' '}
                Establish Direct Connection Terminal
                <span aria-hidden="true">→</span>
              </Link>

              <div className="v3-contact-links">
                {CONTACT_LINKS.map(
                  ({ href, Icon, iconBg, iconBorder, iconColor, label, value, external }) => {
                    const isDirect = label === 'Direct Inquiry';
                    return (
                      <a
                        key={label}
                        href={href}
                        onClick={isDirect ? focusComposer : undefined}
                        className="v3-contact-link"
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        data-v3-sound="confirm"
                      >
                        <span
                          className="v3-contact-icon"
                          style={{ background: iconBg, border: iconBorder, color: iconColor }}
                          aria-hidden="true"
                        >
                          <Icon />
                        </span>
                        <span className="v3-contact-link-body">
                          <span className="v3-contact-link-label">{label}</span>
                          <span className="v3-contact-link-value">{value}</span>
                        </span>
                        <span className="v3-contact-arrow" aria-hidden="true">
                          →
                        </span>
                      </a>
                    );
                  }
                )}
              </div>

              <div className="v3-term v3-term--socials">
                <div className="v3-term-head">
                  <span className="v3-term-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="v3-term-title">linktree.sh --list</span>
                </div>
                <div className="v3-term-body">
                  <div className="v3-socials-grid">
                    {LINKTREE_SOCIALS.map(({ href, Icon, label, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="v3-social-tile"
                        aria-label={label}
                        data-v3-sound="confirm"
                      >
                        <span className="v3-social-icon" style={{ color }}>
                          <Icon />
                        </span>
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="v3-contact-right" data-reveal>
              <div className="v3-term v3-term--form">
                <div className="v3-term-head">
                  <span className="v3-term-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="v3-term-title">send-message.sh</span>
                </div>

                <div className="v3-term-body">
                  <form className="v3-form" onSubmit={handleSubmit} noValidate>
                    <div className="v3-honeypot" aria-hidden="true">
                      <label htmlFor="home_confirm_subject_ref">Leave empty</label>
                      <input
                        id="home_confirm_subject_ref"
                        type="text"
                        name="confirm_subject_ref"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="v3-field">
                      <label className="v3-field-label" htmlFor="name-field">
                        your_name
                      </label>
                      <input
                        type="text"
                        id="name-field"
                        className="v3-input"
                        placeholder="John Doe"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </div>

                    <div className="v3-field">
                      <label className="v3-field-label" htmlFor="email-field">
                        your_email
                      </label>
                      <input
                        type="email"
                        id="email-field"
                        className="v3-input"
                        placeholder="john@company.com"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>

                    <div className="v3-field">
                      <label className="v3-field-label" htmlFor="msg-field">
                        message
                      </label>
                      <textarea
                        id="msg-field"
                        className="v3-input v3-textarea"
                        placeholder="Hi Sahinur, I need help with..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                    </div>

                    {turnstileSiteKey ? (
                      <div className="v3-turnstile" ref={turnstileContainerRef} />
                    ) : null}

                    <button
                      type="submit"
                      className="v3-btn v3-btn--primary v3-submit"
                      disabled={isSubmitting}
                      data-v3-sound="confirm"
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                    </button>

                    <div
                      id="form-feedback"
                      className={`v3-form-feedback is-${feedbackState}`}
                      role="status"
                      aria-live="polite"
                    >
                      {feedback}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
