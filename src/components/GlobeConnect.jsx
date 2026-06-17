"use client";
import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

export default function GlobeConnect() {
  const containerRef = useRef(null);
  const globeInstanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = ["#06b6d4", "#3b82f6", "#6366f1"]; // Cyan, Blue, Indigo to match the user's config
    const sampleArcs = [
      { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: colors[0] },
      { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: colors[1] },
      { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.5, color: colors[2] },
      { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: colors[0] },
      { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: colors[1] },
      { order: 2, startLat: -15.785493, startLng: -47.909029, endLat: 36.162809, endLng: -115.119411, arcAlt: 0.3, color: colors[2] },
      { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[0] },
      { order: 3, startLat: 21.3099, startLng: -157.8581, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: colors[1] },
      { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
      { order: 4, startLat: 11.986597, startLng: 8.571831, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.5, color: colors[0] },
      { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: colors[1] },
      { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: colors[2] },
      { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[0] },
      { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: colors[1] },
      { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: colors[2] },
      { order: 6, startLat: -15.432563, startLng: 28.315853, endLat: 1.094136, endLng: -63.34546, arcAlt: 0.7, color: colors[0] },
      { order: 6, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: colors[1] },
      { order: 6, startLat: 22.3193, startLng: 114.1694, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
      { order: 7, startLat: -19.885592, startLng: -43.951191, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.1, color: colors[0] },
      { order: 7, startLat: 48.8566, startLng: -2.3522, endLat: 52.52, endLng: 13.405, arcAlt: 0.1, color: colors[1] },
      { order: 7, startLat: 52.52, startLng: 13.405, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[2] },
      { order: 8, startLat: -8.833221, startLng: 13.264837, endLat: -33.936138, endLng: 18.436529, arcAlt: 0.2, color: colors[0] },
      { order: 8, startLat: 49.2827, startLng: -123.1207, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.2, color: colors[1] },
      { order: 8, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: colors[2] },
      { order: 9, startLat: 51.5072, startLng: -0.1276, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
      { order: 9, startLat: 22.3193, startLng: 114.1694, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.7, color: colors[1] },
      { order: 9, startLat: 1.3521, startLng: 103.8198, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.5, color: colors[2] },
      { order: 10, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: colors[0] },
      { order: 10, startLat: 34.0522, startLng: -118.2437, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.3, color: colors[1] },
      { order: 10, startLat: -6.2088, startLng: 106.8456, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.3, color: colors[2] },
      { order: 11, startLat: 41.9028, startLng: 12.4964, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
      { order: 11, startLat: -6.2088, startLng: 106.8456, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.2, color: colors[1] },
      { order: 11, startLat: 22.3193, startLng: 114.1694, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: colors[2] },
      { order: 12, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: colors[0] },
      { order: 12, startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: colors[1] },
      { order: 12, startLat: 22.3193, startLng: 114.1694, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: colors[2] },
      { order: 13, startLat: 52.52, startLng: 13.405, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[0] },
      { order: 13, startLat: 11.986597, startLng: 8.571831, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: colors[1] },
      { order: 13, startLat: -22.9068, startLng: -43.1729, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.1, color: colors[2] },
      { order: 14, startLat: -33.936138, startLng: 18.436529, endLat: 21.395643, endLng: 39.883798, arcAlt: 0.3, color: colors[0] }
    ];

    // Get exact dimension of parent container
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // Initialize Globe
    const globe = Globe()(containerRef.current)
      .width(width)
      .height(height)
      .showAtmosphere(true)
      .atmosphereColor('#FFFFFF') // White atmosphere glow as in user's config
      .atmosphereAltitude(0.1) // 0.1 altitude from config
      .arcsData(sampleArcs)
      .arcStartLat(d => d.startLat)
      .arcStartLng(d => d.startLng)
      .arcEndLat(d => d.endLat)
      .arcEndLng(d => d.endLng)
      .arcColor(d => d.color)
      .arcAltitude(d => d.arcAlt)
      .arcStroke(0.6)
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000);

    // Configure orbit controls rotation & disable drag/zoom interaction
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false; // Disable user zoom interactions
      controls.enableRotate = false; // Disable user rotate interactions
    }

    globeInstanceRef.current = globe;

    // Customize Material emissive properties directly matching user config
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color('#062056'); // Deep blue globe color
    globeMaterial.emissive = new THREE.Color('#062056'); // Emissive color match
    globeMaterial.emissiveIntensity = 0.1; // 0.1 intensity
    globeMaterial.shininess = 0.9; // 0.9 shininess

    // Fetch and draw transparent countries boundaries polygon layer
    fetch('/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        globe.polygonsData(countries.features)
          .polygonCapColor(() => 'rgba(255, 255, 255, 0.7)') // White country caps (rgba(255,255,255,0.7) in user config)
          .polygonSideColor(() => 'rgba(0, 0, 0, 0)')
          .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.15)') // Soft borders
          .polygonAltitude(0.01);
      })
      .catch(err => console.error("Error loading boundaries:", err));

    // Focus camera point of view
    globe.pointOfView({ lat: 22.3193, lng: 114.1694, altitude: 2.2 });

    const handleResize = () => {
      if (!containerRef.current || !globeInstanceRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      globeInstanceRef.current.width(rect.width).height(rect.height || 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeInstanceRef.current) {
        // Clean up WebGL context when unmounting
        try {
          globeInstanceRef.current._destructor?.();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div id="globe-container" ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}></div>
  );
}
