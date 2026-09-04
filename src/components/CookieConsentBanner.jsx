"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getConsentStatus, getConsentChoice, setConsentChoice } from "@/lib/consent";

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    // Only show banner if user has not yet made a choice
    const choice = getConsentChoice();
    const status = getConsentStatus();
    if (choice === "none" && status === "pending") {
      // Small delay so it doesn't disrupt initial page entry animation
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setAnalyticsEnabled(status === "granted");
    }
  }, []);

  // Allow re-opening preferences at any time from footer or settings
  useEffect(() => {
    const handleOpenPrefs = () => {
      const status = getConsentStatus();
      setAnalyticsEnabled(status === "granted");
      setShowPreferences(true);
      setVisible(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPrefs);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenPrefs);
  }, []);

  // Strictly do NOT render cookie banner on /studio or /studio-login
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  const handleAcceptAll = () => {
    setConsentChoice("accept_all", true);
    setAnalyticsEnabled(true);
    setVisible(false);
  };

  const handleDecline = () => {
    setConsentChoice("reject", false);
    setAnalyticsEnabled(false);
    setVisible(false);
  };

  const handleSavePreferences = () => {
    setConsentChoice("custom", analyticsEnabled);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="cookie-banner-wrapper"
      role="region"
      aria-label="Privacy & Cookie Preferences"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-header">
          <div className="cookie-banner-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="cookie-banner-title">Privacy & Performance</span>
        </div>

        {!showPreferences ? (
          <>
            <p className="cookie-banner-text">
              We use anonymous telemetry &amp; caching to measure site performance and ensure fast repeat loads. No personally identifiable info is ever sold or tracked.
            </p>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-accept"
                onClick={handleAcceptAll}
              >
                Accept All
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-decline"
                onClick={handleDecline}
              >
                Decline
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-manage"
                onClick={() => setShowPreferences(true)}
              >
                Preferences
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-prefs-body">
            <div className="cookie-pref-row">
              <div>
                <div className="cookie-pref-name">Essential Storage &amp; Cache</div>
                <div className="cookie-pref-sub">Service worker and local preferences</div>
              </div>
              <span className="cookie-pref-badge">Always Active</span>
            </div>

            <div className="cookie-pref-row">
              <div>
                <div className="cookie-pref-name">Anonymous Analytics</div>
                <div className="cookie-pref-sub">Google Analytics 4 &amp; Vercel Web Analytics</div>
              </div>
              <label className="cookie-switch" aria-label="Toggle anonymous analytics">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                />
                <span className="cookie-slider" />
              </label>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-accept"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-decline"
                onClick={handleDecline}
              >
                Reject All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
