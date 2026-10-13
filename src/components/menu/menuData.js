import {
  FolderKanban,
  History,
  Globe,
  Puzzle,
  ShoppingBag,
  PenLine,
  BookOpen,
  Network,
  Laptop,
  FlaskConical,
  Video,
  Orbit,
  Archive,
} from 'lucide-react';
import { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS } from '@/config/navigation';

/**
 * Menu Section Content Map (Section 5)
 * Founder Decision (2026-10-12): Icon + Title only, zero descriptions.
 * Distinct Lucide icons (stroke 1.5), continuous layout across WORK, KNOWLEDGE, LAB.
 */
export const MENU_SECTIONS = [
  {
    id: 'work',
    name: 'WORK',
    count: '05',
    items: [
      {
        id: 'projects',
        title: 'Projects',
        href: '/#projects',
        icon: FolderKanban,
        isExternal: false,
      },
      {
        id: 'experience',
        title: 'Experience',
        href: '/#experience',
        icon: History,
        isExternal: false,
      },
      {
        id: 'wefik',
        title: 'WEFIK',
        href: '/wefik',
        icon: Globe,
        isExternal: true, // External venture showcase with permanent accent arrow
      },
      {
        id: 'plugin',
        title: 'Plugin',
        href: '/plugin',
        icon: Puzzle,
        isExternal: false,
      },
      {
        id: 'store',
        title: 'Store',
        href: '/store',
        icon: ShoppingBag,
        isExternal: false,
      },
    ],
  },
  {
    id: 'knowledge',
    name: 'KNOWLEDGE',
    count: '04',
    items: [
      {
        id: 'blog',
        title: 'Blog',
        href: '/blog',
        icon: PenLine,
        isExternal: false,
      },
      {
        id: 'wiki',
        title: 'Wiki',
        href: '/wiki',
        icon: BookOpen,
        isExternal: false,
      },
      {
        id: 'architecture',
        title: 'Architecture',
        href: '/architecture',
        icon: Network,
        isExternal: false,
      },
      {
        id: 'uses',
        title: 'Uses',
        href: '/uses',
        icon: Laptop,
        isExternal: false,
      },
    ],
  },
  {
    id: 'lab',
    name: 'LAB',
    count: '04',
    items: [
      {
        id: 'play',
        title: 'Play',
        href: '/play',
        icon: FlaskConical,
        isExternal: false,
      },
      {
        id: 'lounge',
        title: 'Lounge',
        href: '/lounge',
        icon: Video,
        isExternal: false,
      },
      {
        id: 'space',
        title: 'Space',
        href: '/space',
        icon: Orbit,
        isExternal: false,
      },
      {
        id: 'vault',
        title: 'Vault',
        href: '/vault',
        icon: Archive,
        isExternal: false,
      },
    ],
  },
];

export { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS };
