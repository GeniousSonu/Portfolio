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

    // In local development (npm run dev), unregister any active service worker to prevent
    // dev server request loops, cache collisions with Turbopack, and loader freezing.
    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log("PWA: Development mode active; unregistered service worker to prevent dev loops.");
        }
      });
      return () => window.removeEventListener("beforeinstallprompt", handleEarlyPrompt);
    }

    // 2. Production Service Worker & Update Coordination
    // Check if the page had an existing controller when it initially loaded.
    // If it did NOT (first-time visit or fresh install), claiming the client is the initial setup
    // and must NEVER reload the page. Only true updates (replacing an existing worker) reload.
    let hadExistingController = Boolean(navigator.serviceWorker.controller);
    let swRegistration = null;
    let isReloading = false;

    const handleControllerChange = () => {
      // First-time install: page already has the freshest assets, do NOT reload
      if (!hadExistingController) {
        hadExistingController = true;
        console.log("PWA: Initial service worker claimed control (first install, skipping reload).");
        return;
      }

      if (isReloading) return;

      // Prevent reload loops: reload at most once per 30 seconds
      const lastReload = sessionStorage.getItem("pwa_sw_last_reload");
      const now = Date.now();
      if (lastReload && now - Number(lastReload) < 30000) {
        console.log("PWA: Duplicate controllerchange ignored (recently reloaded).");
        return;
      }

      isReloading = true;
      sessionStorage.setItem("pwa_sw_last_reload", String(now));
      console.log("PWA: New service worker activated. Silently reloading page once to apply update.");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // 3. Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        swRegistration = registration;

        // If an updated worker is already waiting, tell it to skip waiting immediately
        if (registration.waiting && navigator.serviceWorker.controller) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        // Listen for new worker updates
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("PWA: New service worker version installed. Triggering skipWaiting.");
                installingWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      } catch (err) {
        console.warn("PWA Service Worker registration error:", err);
      }
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW, { once: true });
    }

    // 4. Check for updates when PWA is reopened from home screen or brought to foreground
    // Throttled to at most once per 60 seconds to prevent rapid-fire requests
    let lastUpdateCheck = Date.now();
    const handleCheckUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateCheck < 60000) return;
      lastUpdateCheck = now;

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

    // Periodic check every 60 minutes for long-running sessions
    const interval = setInterval(handleCheckUpdate, 60 * 60 * 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleEarlyPrompt);
      window.removeEventListener("load", registerSW);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return null;
}
