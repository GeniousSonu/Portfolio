import React from 'react';
import { preload } from 'react-dom';
import HomeV3 from '@/components/v3/home/HomeV3';

export default function Home() {
  preload('/fonts/v3/bricolage-grotesque-200-800.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
  preload('/fonts/v3/instrument-serif-400.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return <HomeV3 />;
}
