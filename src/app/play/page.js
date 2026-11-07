import React from 'react';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import PlayClient from './PlayClient';
import styles from './play.module.css';

export const metadata = buildMetadata({
  title: 'Play With Me — Interactive Web Audio & Strategy Lab',
  description:
    'Interactive web experiments, Web Audio synthesizer, competitive chess challenges (1650 ELO), and gaming stats with SK Sahinur Islam.',
  path: '/play',
});

export default function PlayPage() {
  return (
    <PageShell dataRoute="/play">
      <PageHeader
        eyebrow="Interactive"
        title="Play With Me — Audio Nodes & Strategy"
        summary="A sandbox of client-side Web Audio experiments, real-time chess challenges, and gaming stats exploring interface craft."
      />

      <Section className={styles.wrapper}>
        <Container>
          <div className={styles.intro}>
            <p className={styles.introText}>
              Engineering is best balanced with play. Below are real, interactive client nodes: a
              native Web Audio synthesizer, competitive chess profiles for async and live matches,
              and competitive gaming stats.
            </p>
          </div>

          <PlayClient />
        </Container>
      </Section>
    </PageShell>
  );
}
