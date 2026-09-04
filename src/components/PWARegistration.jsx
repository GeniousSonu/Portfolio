"use client";
import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // 1. Capture beforeinstallprompt globally as early as possible so it is never lost
    const handleEarlyPrompt = (e) => {
      e.preventDefault();
      window.__pwaDeferredPrompt = e;
      window.dispatchEvent(new CustomEvent("pwa-prompt-ready"));
      console.log("PWA: Native beforeinstallprompt captured globally.");
    };

    window.addEventListener("beforeinstallprompt", handleEarlyPrompt);

    if (!("serviceWorker" in navigator)) {
      return () => window.removeEventListener("beforeinstallprompt", handleEarlyPrompt);
    }

    let swRegistration = null;
    let refreshing = false;

    // 2. Controller change listener:
    // When a new service worker activates and claims clients, reload once silently.
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;

      // Prevent potential reload loop if controllerchange fires multiple times in quick succession
      const lastReload = sessionStorage.getItem("pwa_sw_last_reload");
      const now = Date.now();
      if (lastReload && now - Number(lastReload) < 5000) {
        console.log("PWA: Rapid controller change detected; skipping duplicate reload.");
        return;
      }
      sessionStorage.setItem("pwa_sw_last_reload", String(now));

      console.log("PWA: New service worker active. Silently reloading to apply update.");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // 3. Register service worker and wire update checks
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        swRegistration = registration;

        // If there is already an installed worker waiting, tell it to skip waiting immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        // Listen for future worker updates
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New worker is ready and an existing controller is running; skip waiting immediately
                console.log("PWA: New service worker installed. Triggering skipWaiting.");
                installingWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });

        // Trigger immediate check against server
        registration.update().catch(() => {});
      } catch (err) {
        console.warn("PWA Service Worker registration error:", err);
      }
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    // 4. Actively check for updates when PWA is reopened from home screen or brought to foreground
    const handleCheckUpdate = () => {
      if (swRegistration) {
        swRegistration.update().catch(() => {});
      } else if (navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update().catch(() => {});
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleCheckUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handleCheckUpdate);
    window.addEventListener("focus", handleCheckUpdate);

    // Periodic check every 60 minutes for long-lived sessions
    const interval = setInterval(handleCheckUpdate, 60 * 60 * 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleEarlyPrompt);
      window.removeEventListener("load", registerSW);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handleCheckUpdate);
      window.removeEventListener("focus", handleCheckUpdate);
      clearInterval(interval);
    };
  }, []);

  return null;
}
