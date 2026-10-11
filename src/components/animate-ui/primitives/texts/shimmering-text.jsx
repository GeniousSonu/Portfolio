"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ShimmeringText component inspired by animate-ui.com text primitives
 * Adds dynamic light sweep effect across typography.
 */
export function ShimmeringText({
  children,
  className,
  duration = 3,
  ...props
}) {
  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-400 select-none",
        className
      )}
      {...props}
    >
      <motion.span
        className="absolute inset-0 block bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "easeInOut",
          repeatDelay: 1.5,
        }}
      />
      {children}
    </span>
  );
}

export default ShimmeringText;
