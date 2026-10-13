import React from 'react';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import WikiClient from './WikiClient';
import styles from './wiki.module.css';

export const metadata = buildMetadata({
  title: 'Personal Wiki & Digital Garden — SK Sahinur Islam',
  description:
    'Digital garden, patent architecture breakdowns, systems design notes, WebRTC network topology, and Linux hardening specifications curated by SK Sahinur Islam.',
  path: '/wiki',
});

export default function WikiPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ DIGITAL GARDEN · KNOWLEDGE BASE ]"
        title="Personal Wiki & Systems Knowledge Base"
        summary="A living repository of architectural blueprints, patent specifications, network protocols, and infrastructure doctrine refined through years of production engineering."
      />

      <Section className={styles.wrapper}>
        <Container>
          <WikiClient />
        </Container>
      </Section>
    </PageShell>
  );
}
