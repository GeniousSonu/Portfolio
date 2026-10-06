'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { usePlayground } from '@/context/PlaygroundContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

export function PlayableElement({ children, className = '', style = {} }) {
  const { isPlaygroundActive } = usePlayground();
  const elRef = useRef(null);
  const draggableRef = useRef(null);

  useEffect(() => {
    if (isPlaygroundActive && elRef.current) {
      draggableRef.current = Draggable.create(elRef.current, {
        type: 'x,y',
        bounds: document.body,
        inertia: true,
      })[0];
    } else {
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
        // Reset transform
        gsap.set(elRef.current, { clearProps: 'x,y' });
      }
    }

    return () => {
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
    };
  }, [isPlaygroundActive]);

  return (
    <div
      ref={elRef}
      className={`${className} ${isPlaygroundActive ? 'cursor-move ring-2 ring-emerald-500/50 rounded-lg p-2' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function EditableText({
  tag: Tag = 'span',
  children,
  className = '',
  style = {},
}) {
  const { isPlaygroundActive } = usePlayground();

  return (
    <Tag
      contentEditable={isPlaygroundActive}
      suppressContentEditableWarning={true}
      className={`${className} ${
        isPlaygroundActive
          ? 'outline-none border-b-2 border-dashed border-emerald-500/50 bg-emerald-500/10 px-1 rounded transition-colors duration-300'
          : ''
      }`}
      style={{
        ...style,
        cursor: isPlaygroundActive ? 'text' : 'inherit',
      }}
    >
      {children}
    </Tag>
  );
}
