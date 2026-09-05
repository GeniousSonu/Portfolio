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
    // and must NEVER reload the page. Only true updates (replacing an existing worker) can update.
    let hadExistingController = Boolean(navigator.serviceWorker.controller);
    let swRegistration = null;
    let updatePendingReload = false;

    const handleControllerChange = () => {
      // First-time install: page already has the freshest assets, do NOT reload
      if (!hadExistingController) {
        hadExistingController = true;
        console.log("PWA: Initial service worker claimed control (first install, skipping reload).");
        return;
      }

      // CRITICAL STABILITY FIX: NEVER reload while the user is actively viewing, reading, or scrolling the page!
      // In an installed PWA, unexpected reloads look identical to an app crash/sudden close.
      if (document.visibilityState === "hidden") {
        console.log("PWA: App in background and new service worker activated. Refreshing cache silently.");
        window.location.reload();
      } else {
        // Defer reload until the user leaves or backgrounds the app
        console.log("PWA: New service worker activated. Update staged for next session/backgrounding (no interrupt during active scroll).");
        updatePendingReload = true;
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // 3. Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        swRegistration = registration;

        // If an updated worker is already waiting, tell it to skip waiting
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

    // 4. Check for updates ONLY when explicitly resuming from background after significant time (10+ minutes)
    let lastUpdateCheck = Date.now();
    const handleCheckUpdate = () => {
      const now = Date.now();
      // Minimum 10 minutes between update checks to prevent rapid checks during navigation/scroll
      if (now - lastUpdateCheck < 10 * 60 * 1000) return;
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
      if (document.visibilityState === "hidden") {
        // If an update was staged while the user was reading, perform the reload now that they've backgrounded the app
        if (updatePendingReload) {
          updatePendingReload = false;
          window.location.reload();
        }
      } else if (document.visibilityState === "visible") {
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
