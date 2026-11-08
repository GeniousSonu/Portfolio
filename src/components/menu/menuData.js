import {
  FolderKanban,
  Globe,
  Puzzle,
  Blocks,
  ShoppingBag,
  PenLine,
  BookOpen,
  Network,
  Laptop,
  Terminal,
  FlaskConical,
  Archive,
  Video,
  Orbit,
} from 'lucide-react';
import { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS } from '@/config/navigation';

/**
 * Menu Section Content Map
 * Icon + Title, compact and aligned with navigation config
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
        id: 'wefik',
        title: 'WEFIK',
        href: '/wefik',
        icon: Globe,
        isExternal: false,
      },
      {
        id: 'plugin',
        title: 'Plugins',
        href: '/plugin',
        icon: Puzzle,
        isExternal: false,
        targetAppHost: true,
      },
      {
        id: 'extension',
        title: 'Extensions',
        href: '/extensions',
        icon: Blocks,
        isExternal: false,
        targetAppHost: true,
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
    count: '05',
    items: [
      {
        id: 'tools',
        title: 'Tools',
        href: '/tools',
        icon: Terminal,
        isExternal: false,
      },
      {
        id: 'play',
        title: 'Play',
        href: '/play',
        icon: FlaskConical,
        isExternal: false,
      },
      {
        id: 'vault',
        title: 'Vault',
        href: '/vault',
        icon: Archive,
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
    ],
  },
];

export { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS };
