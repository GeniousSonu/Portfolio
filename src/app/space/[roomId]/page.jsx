import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceView from '../SpaceView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { roomId } = await params;
  return {
    title: `Sync Room (${roomId}) — Space`,
    description: 'Private ephemeral sync room for real-time text and clipboard sharing across your devices.',
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

export default async function SpaceRoomPage({ params }) {
  const { roomId } = await params;

  return (
    <>
      <Navbar />
      <SpaceView roomId={roomId} />
      <Footer />
    </>
  );
}
