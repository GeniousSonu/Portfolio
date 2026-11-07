import React from 'react';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import OfflineView from './OfflineView';
import styles from './offline.module.css';

export const metadata = buildMetadata({
  title: 'Offline — Network Disconnected',
  description:
    'You are currently browsing without an active internet connection. Cached pages and offline resources remain accessible.',
  path: '/offline',
  noIndex: true,
});

export default function OfflinePage() {
  return (
    <PageShell dataRoute="/offline">
      <PageHeader
        eyebrow="[ PWA TELEMETRY · DISCONNECTED ]"
        title="Offline Mode Active"
        summary="Cached pages remain available offline. Reconnect to a network to view live updates, send messages, and access interactive tools."
      />
      <Section className={styles.wrapper}>
        <Container>
          <OfflineView />
        </Container>
      </Section>
    </PageShell>
  );
}
