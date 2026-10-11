'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SlidingNumber Component from Animate UI (https://animate-ui.com/docs)
 * Smoothly animates numerical transitions using spring physics.
 */
export function SlidingNumber({ value = 0, className }) {
  const numValue = typeof value === 'number' ? value : Number(value) || 0;
  const spring = useSpring(numValue, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('en-US'));

  useEffect(() => {
    spring.set(numValue);
  }, [spring, numValue]);

  return (
    <motion.span className={cn('tabular-nums font-mono', className)}>
      {display}
    </motion.span>
  );
}

export default SlidingNumber;
