"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function WaterRippleEffect({
  imageSrc = "/water-ripple-background.svg",
  width = 920,
  height = 955,
  waveIntensity = 0.012,
  rippleIntensity = 0.025,
  animationSpeed = 1.0,
  hoverRippleMultiplier = 3.5,
  transitionSpeed = 0.08,
  className = "",
  waveFrequency = 10.0,
  rippleFrequency = 20.0,
  distortionAmount = 0.015,
  onHover,
  onLeave,
  ...props
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    const parent = mountElement.parentElement || mountElement;
    let w = parent.clientWidth || window.innerWidth;
    let h = parent.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp",
    });

    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";

    mountElement.appendChild(canvas);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageSrc, (loadedTexture) => {
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.minFilter = THREE.LinearFilter;
      loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.needsUpdate = true;
    });

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D texture1;
      uniform float time;
      uniform vec2 mouse;
      uniform float hoverIntensity;
      uniform float waveIntensity;
      uniform float rippleIntensity;
      uniform float animationSpeed;
      uniform float waveFrequency;
      uniform float rippleFrequency;
      uniform float distortionAmount;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        float waveScale = waveIntensity * 0.5;
        
        float wave1 = sin(uv.x * waveFrequency + time * animationSpeed * 2.0) * waveScale;
        float wave2 = sin(uv.y * (waveFrequency * 0.8) + time * animationSpeed * 1.5) * (waveScale * 0.8);
        float wave3 = sin((uv.x + uv.y) * (waveFrequency * 1.2) + time * animationSpeed * 2.5) * (waveScale * 0.3);
        
        float dist = distance(uv, mouse);
        float rippleScale = rippleIntensity * 0.7;
        
        float falloff = exp(-dist * 4.0);
        
        float mouseWave1 = sin(dist * rippleFrequency - time * animationSpeed * 4.0) * 
                          falloff * hoverIntensity * rippleScale;
        float mouseWave2 = sin(dist * (rippleFrequency * 0.75) - time * animationSpeed * 3.0) * 
                          falloff * hoverIntensity * (rippleScale * 0.6);
        
        float ripple1 = sin(length(uv - mouse) * (rippleFrequency * 1.25) - time * animationSpeed * 5.0) * 
                       exp(-length(uv - mouse) * 5.0) * hoverIntensity * (rippleScale * 0.8);
        float ripple2 = sin(length(uv - mouse) * (rippleFrequency * 0.9) - time * animationSpeed * 3.5) * 
                       exp(-length(uv - mouse) * 4.0) * hoverIntensity * (rippleScale * 0.6);
        
        float totalWave = (wave1 + wave2 + wave3 + mouseWave1 + mouseWave2 + ripple1 + ripple2) * 0.5;
        
        float distortScale = distortionAmount * 0.6;
        vec2 distortion = vec2(
          sin(uv.x * (waveFrequency * 0.8) + time * animationSpeed * 1.8) * distortScale * 0.4 + 
          sin(uv.y * (waveFrequency * 0.6) + time * animationSpeed * 2.2) * distortScale * 0.3,
          sin(uv.y * (waveFrequency * 0.7) + time * animationSpeed * 1.6) * distortScale * 0.4 + 
          sin(uv.x * (waveFrequency * 0.9) + time * animationSpeed * 2.0) * distortScale * 0.3
        );
        
        vec2 mouseDir = uv - mouse;
        float mouseDist = length(mouseDir);
        vec2 mouseDistortion = normalize(mouseDir) * sin(mouseDist * rippleFrequency - time * animationSpeed * 4.0) * 
                              exp(-mouseDist * 4.0) * hoverIntensity * distortScale * 0.5;
        
        vec2 finalDistortion = (distortion + mouseDistortion) * 0.7 + vec2(totalWave * 0.2, totalWave * 0.2);
        
        vec2 distortedUv = clamp(uv + finalDistortion, 0.0, 1.0);
        
        // Pure texture sampling without any added color tints or wave overlays
        vec4 color = texture2D(texture1, distortedUv);
        
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { value: texture },
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        hoverIntensity: { value: 0.5 },
        waveIntensity: { value: waveIntensity },
        rippleIntensity: { value: rippleIntensity },
        animationSpeed: { value: animationSpeed },
        waveFrequency: { value: waveFrequency },
        rippleFrequency: { value: rippleFrequency },
        distortionAmount: { value: distortionAmount },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    materialRef.current = material;

    const handleMouseMove = (event) => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      onHover?.();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      onLeave?.();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      w = parent.clientWidth || window.innerWidth;
      h = parent.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h, false);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();

    const animate = () => {
      timeRef.current += 0.016;

      if (materialRef.current) {
        materialRef.current.uniforms.time.value = timeRef.current;
        materialRef.current.uniforms.mouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
        const targetIntensity = isHoveredRef.current
          ? hoverRippleMultiplier
          : 0.5;
        const currentIntensity =
          materialRef.current.uniforms.hoverIntensity.value;
        materialRef.current.uniforms.hoverIntensity.value +=
          (targetIntensity - currentIntensity) * transitionSpeed;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();

      if (mountElement && canvas && mountElement.contains(canvas)) {
        mountElement.removeChild(canvas);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [
    imageSrc,
    width,
    height,
    waveIntensity,
    rippleIntensity,
    animationSpeed,
    hoverRippleMultiplier,
    transitionSpeed,
    waveFrequency,
    rippleFrequency,
    distortionAmount,
    onHover,
    onLeave,
  ]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      {...props}
    />
  );
}
