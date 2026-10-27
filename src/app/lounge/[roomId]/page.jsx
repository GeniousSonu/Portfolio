import React from 'react';
import LoungeRoomView from '../LoungeRoomView';

export async function generateMetadata({ params }) {
  const { roomId } = await params;
  return {
    title: `The Lounge · Room ${roomId} — SK Sahinur Islam`,
    description: `Active synchronized Lounge hangout session ${roomId}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LoungeRoomPage({ params }) {
  const { roomId } = await params;

  return <LoungeRoomView roomId={roomId} />;
}
