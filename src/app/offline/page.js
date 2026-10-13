import React from 'react';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import OfflineView from './OfflineView';
import styles from './offline.module.css';

export const metadata = buildMetadata({
  title: 'Offline — Network Disconnected',
  description: 'You are currently browsing without an active internet connection. Cached pages and offline resources remain accessible.',
  path: '/offline',
  noIndex: true,
});

export default function OfflinePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ PWA TELEMETRY · DISCONNECTED ]"
        title="Offline Mode Active"
        summary="Service Worker is serving local assets. Reconnect to a network to synchronize real-time telemetry, live chat, and collaborative spaces."
      />
      <Section className={styles.wrapper}>
        <Container>
          <OfflineView />
        </Container>
      </Section>
    </PageShell>
  );
}
