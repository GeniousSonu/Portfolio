"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── iOS Share Icon (for instruction tooltip) ── */
const IOSShareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

/* ── Download / Install Icon ── */
const InstallIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);
  const tipRef = useRef(null);
  const isIOSRef = useRef(false);

  useEffect(() => {
    // Already installed → hide completely
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.navigator?.standalone === true) return; // iOS standalone

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android|CriOS|FxiOS|OPiOS|EdgiOS).)*safari/i.test(ua);

    if (isiOS && isSafari) {
      isIOSRef.current = true;
      // Use a microtask to avoid the synchronous setState-in-effect lint error
      queueMicrotask(() => {
        setIsIOS(true);
        setShowButton(true);
      });
      return;
    }

    // Android / Chrome desktop — listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Hide after install completes
    const installed = () => {
      setShowButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  // Close iOS tooltip on outside click
  useEffect(() => {
    if (!showIOSTip) return;
    const outsideClick = (e) => {
      if (tipRef.current && !tipRef.current.contains(e.target)) {
        setShowIOSTip(false);
      }
    };
    document.addEventListener("mousedown", outsideClick);
    document.addEventListener("touchstart", outsideClick);
    return () => {
      document.removeEventListener("mousedown", outsideClick);
      document.removeEventListener("touchstart", outsideClick);
    };
  }, [showIOSTip]);

  const handleClick = useCallback(async () => {
    if (isIOS) {
      setShowIOSTip((prev) => !prev);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowButton(false);
    }
    setDeferredPrompt(null);
  }, [isIOS, deferredPrompt]);

  if (!showButton) return null;

  return (
    <div className="install-app-wrapper" ref={tipRef}>
      <button
        className="install-app-btn"
        onClick={handleClick}
        aria-label="Install App"
        title="Install App"
      >
        <InstallIcon />
        <span className="install-app-label">Install</span>
      </button>

      {/* iOS Safari instruction tooltip */}
      {showIOSTip && (
        <div className="install-ios-tooltip" role="alert">
          <button
            className="install-ios-close"
            onClick={() => setShowIOSTip(false)}
            aria-label="Close install instructions"
          >
            ×
          </button>
          <p className="install-ios-title">Install this app</p>
          <ol className="install-ios-steps">
            <li>
              Tap the <IOSShareIcon /> <strong>Share</strong> button in Safari
            </li>
            <li>Scroll down the share sheet</li>
            <li>
              Tap <strong>&quot;Add to Home Screen&quot;</strong>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
