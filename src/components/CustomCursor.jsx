"use client";
import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(cursor, { x: mx, y: my, duration: 0.05, ease: 'none' });
    };

    document.addEventListener('mousemove', handleMouseMove);

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
