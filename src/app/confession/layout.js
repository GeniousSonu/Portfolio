import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Cryptographic Confession Box',
  description: 'Anonymous cryptographic feedback transmission channel. Leave secure feedback for Genious Sonu.',
  path: '/confession',
});

export default function ConfessionLayout({ children }) {
  return children;
}
