"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * UserPreferences manages non-sensitive settings in localStorage:
 * - Reduce Motion toggle (respects system + user manual override)
 * - Last visited timestamp & route
 */
export default function UserPreferences() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Record last visited timestamp and page
    try {
      localStorage.setItem("sks_last_visited_at", new Date().toISOString());
      localStorage.setItem("sks_last_route", pathname || "/");
    } catch {
      // Storage unavailable
    }

    // 2. Reduce Motion Preference
    const applyMotionPreference = () => {
      try {
        const manualPref = localStorage.getItem("sks_reduce_motion");
        const systemPref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const shouldReduce = manualPref === "true" || (manualPref === null && systemPref);

        if (shouldReduce) {
          document.documentElement.classList.add("reduce-motion");
        } else {
          document.documentElement.classList.remove("reduce-motion");
        }
      } catch {
        // Ignore
      }
    };

    applyMotionPreference();

    // Global toggle method for quick accessibility testing
    window.__toggleReduceMotion = () => {
      const current = localStorage.getItem("sks_reduce_motion") === "true";
      const next = !current;
      localStorage.setItem("sks_reduce_motion", next.toString());
      applyMotionPreference();
      console.log(`Reduce Motion set to: ${next}`);
      return next;
    };
  }, [pathname]);

  return null;
}
