import React from 'react';
import { PageShell, PageHeader, PageStub } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';

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
        eyebrow="[ PWA TELEMETRY · STATUS 0 ]"
        title="Offline Mode Active"
        summary="Your client appears to be disconnected from the network. Cached pages and Service Worker resources remain available."
      />
      <PageStub
        title="Client Operating in Offline Storage"
        summary="Service Worker vCache is serving local assets. Reconnect to a network to synchronize real-time telemetry, live chat, and collaborative spaces."
        status="stub"
        routeHref="/offline"
      />
    </PageShell>
  );
}
