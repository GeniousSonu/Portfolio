"use client";
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const loaderTexts = [
  'Initializing kernel modules...',
  'Mounting filesystems...',
  'Loading network interfaces...',
  'Starting services...',
  'Handshake complete.',
];

export default function Loader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [percent, setPercent] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < loaderTexts.length) {
        setIndex(currentIdx);
        setPercent((currentIdx / loaderTexts.length) * 100);
      } else {
        clearInterval(interval);
        setPercent(100);
        setTimeout(() => {
          const loader = document.getElementById('loader');
          if (loader) {
            gsap.to(loader, {
              opacity: 0,
              duration: 0.6,
              ease: 'power2.in',
              onComplete: () => {
                loader.style.display = 'none';
                if (onCompleteRef.current) onCompleteRef.current();
              }
            });
          } else {
            if (onCompleteRef.current) onCompleteRef.current();
          }
        }, 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="loader" role="status" aria-label="Loading">
      <div className="loader-logo">[SK/]</div>
      <div className="loader-text" id="loader-text">
        {loaderTexts[index]}
      </div>
      <div className="loader-bar">
        <div 
          className="loader-bar-fill" 
          id="loader-fill" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
