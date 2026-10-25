import React from 'react';

export default function Emoji3D({ name, size = 64, alt = '', priority = false, className = '' }) {
  return (
    <img
      src={`/emoji/3d/${name}.webp`}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : 'true'}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`v3-emoji ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
