import React from 'react';
import { notFound } from 'next/navigation';
import SoundAuditionClient from './SoundAuditionClient';

export const metadata = {
  title: 'Sound & Feel Audition Lab | Dev Audition',
  description: 'Audition shortlisted lofi music tracks and test sound effects in light and dark modes.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SoundAuditionPage() {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') {
    notFound();
  }
  return <SoundAuditionClient />;
}
