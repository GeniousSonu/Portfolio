import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Play & Chess Lounge',
  description: 'Challenge SK Sahinur Islam in chess or view gaming telemetry and rapid rankings.',
  path: '/play',
});

export default function PlayLayout({ children }) {
  return children;
}
