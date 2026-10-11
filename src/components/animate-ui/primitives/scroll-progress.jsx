"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ScrollProgress component inspired by animate-ui.com primitives
 * Displays a sleek, animated scroll progress bar pinned to the top of the viewport.
 */
export function ScrollProgress({ className, ...props }) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 35,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 origin-left z-[9999] pointer-events-none shadow-[0_0_12px_rgba(99,102,241,0.6)]",
        className
      )}
      style={{ scaleX }}
      {...props}
    />
  );
}

export default ScrollProgress;
