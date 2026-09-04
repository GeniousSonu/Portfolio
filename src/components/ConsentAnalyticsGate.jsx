"use client";
import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getConsentStatus, applyAnalyticsDisableFlag } from "@/lib/consent";

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
 *
 * It guarantees:
 * 1. Zero analytics scripts load on /studio or /studio-login (Sanity Studio CMS).
 * 2. GA4 (@next/third-parties/google), Vercel Analytics, and Speed Insights
 *    only initialize when the user clicks 'Accept' on the cookie consent banner.
 * 3. Immediate tracking termination and cookie removal if consent is revoked.
 */
export default function ConsentAnalyticsGate() {
  const pathname = usePathname();
  const hasConsent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );

  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // If on studio or without consent, ensure disable flag is active
    if (isStudio) {
      if (gaId && typeof window !== "undefined") {
        window[`ga-disable-${gaId}`] = true;
      }
      return;
    }

    // Sync Google Consent Mode v2
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: hasConsent ? "granted" : "denied",
        ad_storage: hasConsent ? "granted" : "denied",
        ad_user_data: hasConsent ? "granted" : "denied",
        ad_personalization: hasConsent ? "granted" : "denied",
      });
    }

    applyAnalyticsDisableFlag();
  }, [hasConsent, isStudio]);

  // Strictly do NOT load on /studio or /studio-login
  if (isStudio) {
    return null;
  }

  return (
    <>
      {/* Vercel Web Analytics & Speed Insights (Mounted only with explicit consent) */}
      {hasConsent ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
}

