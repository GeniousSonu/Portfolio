"use client";
import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Capture beforeinstallprompt globally as early as possible so it is never lost
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

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Periodic update check
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("PWA: New version available. Refresh to update.");
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
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleEarlyPrompt);
      window.removeEventListener("load", registerSW);
    };
  }, []);

  return null;
}
