"use client";
import React, { useState, useEffect } from "react";
import { getConsentStatus, setConsentStatus } from "@/lib/consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    // Only show if user hasn't made a choice yet
    const status = getConsentStatus();
    if (status === "pending") {
      // Small delay so it doesn't disrupt initial page entry animation
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsentStatus("granted");
    setVisible(false);
  };

  const handleDecline = () => {
    setConsentStatus("denied");
    setVisible(false);
  };

  const handleSavePreferences = () => {
    setConsentStatus(analyticsEnabled ? "granted" : "denied");
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
                <div className="cookie-pref-sub">Vercel Web Analytics &amp; Core Web Vitals</div>
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
                onClick={() => setShowPreferences(false)}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
