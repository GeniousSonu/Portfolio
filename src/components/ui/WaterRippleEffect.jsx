"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WaterRippleEffect({
  imageSrc,
  className = '',
  waveIntensity = 0.004,
  rippleIntensity = 0.008,
  animationSpeed = 0.55,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const shouldReduceMotion = window.matchMedia('(max-width: 640px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches;

    if (!mount || shouldReduceMotion) return undefined;

    let renderer;
    let material;
    let geometry;
    let texture;
    let animationFrame;
    let isVisible = true;
    let isDisposed = false;
    const pointer = new THREE.Vector2(0.5, 0.5);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      texture = new THREE.TextureLoader().load(imageSrc);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          texture1: { value: texture },
          time: { value: 0 },
          pointer: { value: pointer },
          waveIntensity: { value: waveIntensity },
          rippleIntensity: { value: rippleIntensity },
          animationSpeed: { value: animationSpeed },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D texture1;
          uniform float time;
          uniform vec2 pointer;
          uniform float waveIntensity;
          uniform float rippleIntensity;
          uniform float animationSpeed;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float t = time * animationSpeed;
            vec2 drift = vec2(
              sin(uv.y * 9.0 + t) * waveIntensity,
              cos(uv.x * 8.0 + t * 0.8) * waveIntensity
            );
            float distanceToPointer = distance(uv, pointer);
            float ripple = sin(distanceToPointer * 28.0 - t * 3.0)
              * exp(-distanceToPointer * 5.0)
              * rippleIntensity;
            vec2 direction = normalize(uv - pointer + vec2(0.0001));
            vec2 distortedUv = clamp(uv + drift + direction * ripple, 0.0, 1.0);
            gl_FragColor = texture2D(texture1, distortedUv);
          }
        `,
      });

      geometry = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geometry, material));
      mount.appendChild(renderer.domElement);
    } catch {
      return undefined;
    }

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (width > 0 && height > 0) renderer.setSize(width, height, false);
    };

    const updatePointer = (event) => {
      const bounds = mount.getBoundingClientRect();
      if (!isVisible || bounds.width === 0 || bounds.height === 0) return;
      pointer.set(
        THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width, 0, 1),
        THREE.MathUtils.clamp(1 - (event.clientY - bounds.top) / bounds.height, 0, 1),
      );
    };

    const render = () => {
      if (isDisposed) return;
      if (isVisible) {
        material.uniforms.time.value += 0.016;
        renderer.render(scene, camera);
      }
      animationFrame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });

    resize();
    resizeObserver.observe(mount);
    visibilityObserver.observe(mount);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    animationFrame = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', updatePointer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [animationSpeed, imageSrc, rippleIntensity, waveIntensity]);

  return <div ref={mountRef} aria-hidden="true" className={className} />;
}
