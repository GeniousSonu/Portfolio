import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceView from './SpaceView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Space — SK Sahinur Islam',
  description: 'Shared real-time collaborative scratchpad.',
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

export default function SpacePage() {
  return (
    <>
      <Navbar />
      <SpaceView />
      <Footer />
    </>
  );
}
