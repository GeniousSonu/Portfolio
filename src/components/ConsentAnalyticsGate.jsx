"use client";
import React, { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getConsentStatus } from "@/lib/consent";

function subscribeConsent(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("analytics-consent-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("analytics-consent-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

function getConsentSnapshot() {
  return getConsentStatus() === "granted";
}

function getConsentServerSnapshot() {
  return false;
}

/**
 * ConsentAnalyticsGate ensures analytics scripts and telemetry components
 * only mount and initialize after explicit user consent has been granted.
 */
export default function ConsentAnalyticsGate() {
  const hasConsent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );

  if (!hasConsent) {
    return null;
  }

  return (
    <>
      {/* Vercel Web Analytics & Speed Insights (Mounted only with consent) */}
      <Analytics />
      <SpeedInsights />

      {/* 
        Future Analytics Slot:
        Plug in Google Analytics, Plausible, PostHog, or custom visitor loggers here.
        They will strictly load only after the user has given consent.
      */}
    </>
  );
}
