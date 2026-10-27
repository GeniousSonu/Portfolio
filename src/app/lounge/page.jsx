import React from 'react';
import LoungeLanding from './LoungeLanding';

export const metadata = {
  title: 'The Lounge · Real-time Virtual Hangout — SK Sahinur Islam',
  description:
    'A synchronized virtual hangout space featuring peer-to-peer screen sharing, synchronized YouTube listening sessions, and real-time spatial orbs.',
  openGraph: {
    title: 'The Lounge · Real-time Virtual Hangout',
    description:
      'A synchronized virtual hangout space featuring peer-to-peer screen sharing, synchronized YouTube listening sessions, and real-time spatial orbs.',
    url: 'https://genioussonu.me/lounge',
    siteName: 'SK Sahinur Islam (Genious Sonu)',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://genioussonu.me/lounge',
  },
};

export default function LoungePage() {
  return <LoungeLanding />;
}
