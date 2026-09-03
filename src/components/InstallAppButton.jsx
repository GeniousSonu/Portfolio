"use client";
import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";

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
    style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px" }}
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
    style={{ display: "inline-block", verticalAlign: "middle", margin: "0 4px" }}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

/* ── Standalone detection store for React 19 ── */
function subscribeStandalone(callback) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);
  return () => {
    mql.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator?.standalone === true ||
    document.referrer.includes("android-app://")
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

export default function InstallAppButton() {
  const isInstalled = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Capture native install prompt event (Chrome Android / Chrome Desktop / Edge)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("PWA: Native beforeinstallprompt captured.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    if (!showModal) return;

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  const handleInstallClick = useCallback(async () => {
    // If native prompt is available (Android Chrome or Desktop Chrome/Edge)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setDeferredPrompt(null);
        }
        return;
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
    }

    // Otherwise, show guided install modal
    setShowModal((prev) => !prev);
  }, [deferredPrompt]);

  // If already installed, hide the button completely
  if (isInstalled) {
    return null;
  }

  const platform = getDevicePlatform();

  return (
    <div className="install-app-wrapper" ref={modalRef}>
      <button
        type="button"
        className="install-app-btn"
        onClick={handleInstallClick}
        aria-label="Install Portfolio App"
        title="Install Web App for Offline Access"
      >
        <InstallIcon />
        <span className="install-app-label">Install App</span>
      </button>

      {/* Guided Install Modal for Android, iOS & Desktop fallback */}
      {showModal && (
        <div className="install-ios-tooltip" role="dialog" aria-modal="true">
          <button
            type="button"
            className="install-ios-close"
            onClick={() => setShowModal(false)}
            aria-label="Close instructions"
          >
            ×
          </button>

          <p className="install-ios-title">Install Portfolio App</p>

          {platform === "ios" ? (
            <ol className="install-ios-steps">
              <li>
                Tap the <IOSShareIcon /> <strong>Share</strong> icon in Safari.
              </li>
              <li>Scroll down the menu.</li>
              <li>
                Tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </li>
            </ol>
          ) : platform === "android" ? (
            <ol className="install-ios-steps">
              <li>
                Tap the browser menu <AndroidMenuIcon /> (3 dots in top right).
              </li>
              <li>
                Tap <strong>&quot;Install app&quot;</strong> or{" "}
                <strong>&quot;Add to Home screen&quot;</strong>.
              </li>
              <li>Confirm to add the app icon to your Android launcher.</li>
            </ol>
          ) : (
            <ol className="install-ios-steps">
              <li>
                Click the <strong>Install</strong> icon in your browser address bar (⊕).
              </li>
              <li>
                Or open Chrome menu (⋮) → <strong>&quot;Install SK Sahinur Islam...&quot;</strong>.
              </li>
            </ol>
          )}

          <div className="install-modal-footer">
            <span>Fast · Offline Ready · Zero Lag</span>
          </div>
        </div>
      )}
    </div>
  );
}
