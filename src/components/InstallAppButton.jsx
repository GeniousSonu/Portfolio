"use client";
import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/* ── SVG Icons ── */
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

const IOSShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px", color: "#38bdf8" }}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const AndroidMenuIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px", color: "#10b981" }}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

/* ── Standalone display-mode detection for React 19 ── */
function subscribeStandalone(callback) {
  if (typeof window === "undefined") return () => {};
  const mqlStandalone = window.matchMedia("(display-mode: standalone)");
  const mqlFullscreen = window.matchMedia("(display-mode: fullscreen)");
  const mqlMinimal = window.matchMedia("(display-mode: minimal-ui)");

  mqlStandalone.addEventListener("change", callback);
  mqlFullscreen.addEventListener("change", callback);
  mqlMinimal.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);

  return () => {
    mqlStandalone.removeEventListener("change", callback);
    mqlFullscreen.removeEventListener("change", callback);
    mqlMinimal.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator?.standalone === true
  );
}

function getStandaloneServerSnapshot() {
  return false;
}

function getDevicePlatform() {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent || "";
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  if (/Android/i.test(ua)) {
    return "android";
  }
  return "desktop";
}

export default function InstallAppButton({ className = "", isMobileMenu = false }) {
  const isInstalled = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );

  const [platform, setPlatform] = useState("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlatform(getDevicePlatform());

    // Check if early prompt was already stored on window
    if (window.__pwaDeferredPrompt) {
      setDeferredPrompt(window.__pwaDeferredPrompt);
    }

    // Capture native beforeinstallprompt (Chrome / Android / Edge)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.__pwaDeferredPrompt = e;
      setDeferredPrompt(e);
      console.log("PWA: Native beforeinstallprompt captured.");
    };

    const handlePromptReady = () => {
      if (window.__pwaDeferredPrompt) {
        setDeferredPrompt(window.__pwaDeferredPrompt);
      }
    };

    const handleAppInstalled = () => {
      window.__pwaDeferredPrompt = null;
      setDeferredPrompt(null);
      setShowModal(false);
      console.log("PWA: App successfully installed.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("pwa-prompt-ready", handlePromptReady);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("pwa-prompt-ready", handlePromptReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!showModal) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  const isIOS = platform === "ios";

  const handleInstallClick = useCallback(async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    // 1. If native prompt is available (Android / Chromium Desktop / Edge)
    const promptEvent = deferredPrompt || (typeof window !== "undefined" ? window.__pwaDeferredPrompt : null);
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === "accepted") {
          setDeferredPrompt(null);
          if (typeof window !== "undefined") window.__pwaDeferredPrompt = null;
        }
        return;
      } catch (err) {
        console.warn("PWA prompt trigger error:", err);
      }
    }

    // 2. On iOS (Safari) or fallback, show guided instructions modal
    setShowModal(true);
  }, [deferredPrompt]);

  // If already installed in standalone PWA mode, don't show install button
  if (isInstalled) {
    return null;
  }

  // Exact expected behavior:
  // - Android/Chrome/Chromium: Appears automatically once beforeinstallprompt fires (or if in mobile menu)
  // - iOS/Safari: Appears immediately because iOS does not support beforeinstallprompt
  // - In full-screen mobile menu drawer: always available so mobile users never miss it
  const canShow = mounted && (isIOS || Boolean(deferredPrompt) || isMobileMenu);
  if (!canShow) {
    return null;
  }

  const modalContent = showModal && mounted && typeof document !== "undefined" ? (
    createPortal(
      <div
        className="install-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Install Portfolio App Instructions"
        onClick={() => setShowModal(false)}
      >
        <div
          className="install-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="install-modal-header">
            <div className="install-modal-badge">
              <InstallIcon />
              <span>INSTALL WEB APP</span>
            </div>
            <button
              type="button"
              className="install-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <h3 className="install-modal-title">Install SK Sahinur Islam App</h3>
          <p className="install-modal-desc">
            Add this portfolio to your home screen for instant full-screen access, lightning-fast load times, and offline browsing.
          </p>

          {/* Platform Specific Steps */}
          {isIOS ? (
            <div className="install-steps-container">
              <div className="install-step-item">
                <span className="install-step-num">1</span>
                <span className="install-step-text">
                  Tap the <IOSShareIcon /> <strong>Share</strong> button at the bottom of Safari.
                </span>
              </div>
              <div className="install-step-item">
                <span className="install-step-num">2</span>
                <span className="install-step-text">
                  Scroll down the share sheet and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                </span>
              </div>
              <div className="install-step-item">
                <span className="install-step-num">3</span>
                <span className="install-step-text">
                  Tap <strong>&quot;Add&quot;</strong> in the top-right corner to finish.
                </span>
              </div>
            </div>
          ) : (
            <div className="install-steps-container">
              <div className="install-step-item">
                <span className="install-step-num">1</span>
                <span className="install-step-text">
                  Tap the browser menu <AndroidMenuIcon /> (three dots in top right).
                </span>
              </div>
              <div className="install-step-item">
                <span className="install-step-num">2</span>
                <span className="install-step-text">
                  Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                </span>
              </div>
              <div className="install-step-item">
                <span className="install-step-num">3</span>
                <span className="install-step-text">
                  Confirm the prompt to add the SONU icon to your launcher.
                </span>
              </div>
            </div>
          )}

          <div className="install-modal-footer">
            <span className="install-feature-tag">✓ Fullscreen App</span>
            <span className="install-feature-tag">✓ Zero Lag</span>
            <span className="install-feature-tag">✓ Offline Ready</span>
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <div className={`install-app-wrapper ${className}`}>
        <button
          type="button"
          className="install-app-btn"
          onClick={handleInstallClick}
          aria-label="Install Portfolio App"
          title={isIOS ? "Add to Home Screen (iOS)" : "Install Web App"}
        >
          <InstallIcon />
          <span className="install-app-label">Install App</span>
        </button>
      </div>

      {modalContent}
    </>
  );
}
