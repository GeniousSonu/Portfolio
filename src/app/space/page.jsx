import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceLanding from './SpaceLanding';
import SpaceView from './SpaceView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ searchParams }) {
  const { mode } = (await searchParams) || {};
  const isLegacy = mode === 'legacy';

  return {
    title: isLegacy
      ? 'Global Scratchpad — Space — SK Sahinur Islam'
      : 'Space — Instant Multi-Device Sync — SK Sahinur Islam',
    description: isLegacy
      ? 'Shared real-time collaborative scratchpad.'
      : 'Instant ephemeral sync rooms for text and code across your phone and laptop with zero logins.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function SpacePage({ searchParams }) {
  const { mode } = (await searchParams) || {};
  const isLegacy = mode === 'legacy';

  return (
    <>
      <Navbar />
      {isLegacy ? <SpaceView /> : <SpaceLanding />}
      <Footer />
    </>
  );
}
