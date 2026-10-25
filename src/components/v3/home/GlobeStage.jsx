'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GlobeConnect = dynamic(() => import('@/components/GlobeConnect'), {
  ssr: false,
  loading: () => null,
});

class GlobeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[v3] WebGL globe unavailable, keeping static fallback.',
        error?.message || error
      );
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GlobeStage() {
  const stageRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '280px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="v3-globe-stage" ref={stageRef}>
      <div className="v3-globe-fallback" aria-hidden="true">
        <span className="v3-globe-orbit v3-globe-orbit--one" />
        <span className="v3-globe-orbit v3-globe-orbit--two" />
        <span className="v3-globe-orbit v3-globe-orbit--three" />
        <span className="v3-globe-core" />
        <span className="v3-globe-pin">
          <span className="v3-globe-pin-dot" />
          <span className="v3-globe-pin-label">Kolkata</span>
        </span>
      </div>

      {shouldMount && !reducedMotion ? (
        <div className="v3-globe-canvas" aria-hidden="true">
          <GlobeBoundary>
            <GlobeConnect />
          </GlobeBoundary>
        </div>
      ) : null}

      <div className="v3-globe-caption">
        <span className="v3-globe-coords">22.5726° N · 88.3639° E</span>
        <span className="v3-globe-place">Kolkata · India</span>
      </div>
    </div>
  );
}
