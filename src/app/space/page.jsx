import SpaceView from './SpaceView';

export const metadata = {
  title: 'Shared Space — Sonu',
  description: 'Public real-time shared clipboard.',
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
  return <SpaceView />;
}
