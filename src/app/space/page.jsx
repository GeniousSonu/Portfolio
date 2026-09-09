import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceLanding from './SpaceLanding';
import SpaceView from './SpaceView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ searchParams }) {
  const { mode } = (await searchParams) || {};
  const isSyncLanding = mode === 'sync';

  return {
    title: isSyncLanding
      ? 'Space — Instant Multi-Device Sync — SK Sahinur Islam'
      : 'Space — Collaborative Scratchpad — SK Sahinur Islam',
    description: isSyncLanding
      ? 'Instant ephemeral sync rooms for text and code across your phone and laptop with zero logins.'
      : 'Shared real-time collaborative scratchpad and instant multi-device sync rooms.',
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
  const isSyncLanding = mode === 'sync';

  return (
    <>
      <Navbar />
      {isSyncLanding ? <SpaceLanding /> : <SpaceView />}
      <Footer />
    </>
  );
}
