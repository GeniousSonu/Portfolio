'use client';

import React from 'react';
import { useTransitionRouter } from '@/context/TransitionContext';

export default function LoadingBar() {
  const { transitionStatus } = useTransitionRouter();
  const isTransitioning = transitionStatus === 'transitioning';

  return (
    <div
      className={`loading-bar-container ${isTransitioning ? 'active' : ''}`}
      aria-hidden="true"
      role="progressbar"
      aria-valuetext={isTransitioning ? 'Loading page' : 'Loaded'}
    >
      {isTransitioning && <div className="loading-bar-progress" />}
    </div>
  );
}
