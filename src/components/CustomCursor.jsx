"use client";
import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let isVisible = false;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
      }
      gsap.to(cursor, { x: mx, y: my, duration: 0.05, ease: 'none' });
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId;
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      animationFrameId = requestAnimationFrame(animateRing);
    };
    animateRing();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
    </>
  );
}
