"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Tilt effect component inspired by animate-ui.com effect primitives
 * Provides smooth 3D mouse parallax tilt.
 */
export function Tilt({
  children,
  className,
  rotationFactor = 12,
  isReversed = false,
  ...props
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 25 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    isReversed
      ? [rotationFactor, -rotationFactor]
      : [-rotationFactor, rotationFactor]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    isReversed
      ? [-rotationFactor, rotationFactor]
      : [rotationFactor, -rotationFactor]
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn("perspective-[1000px] will-change-transform", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Tilt;
