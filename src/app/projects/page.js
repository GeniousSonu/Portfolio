import React, { Suspense } from 'react';
import { getUnifiedProjects } from '@/lib/integrations/github/client';
import ProjectFilterClient from './ProjectFilterClient';
import styles from './projects.module.css';

export const metadata = {
  title: 'Engineering Projects & Case Studies | SK Sahinur Islam',
  description:
    'Selected works in IoT systems, distributed architectures, developer platforms, and high-fidelity product design.',
};

export default async function ProjectsPage() {
  const unified = await getUnifiedProjects();
  const patent = unified.find((project) => project.isPatent);
  const ordered = patent ? [patent, ...unified.filter((project) => project !== patent)] : unified;

  return (
    <main className={styles.pageContainer} data-route="/projects">
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Engineering Dossier
          </div>
          <h1 className={styles.title}>Projects &amp; Inventions</h1>
          <p className={styles.lead}>
            A curated record of production distributed systems, IoT hardware inventions,
            open-source tooling, and client platforms.
          </p>
        </header>

        <Suspense fallback={<div className={styles.emptyState}>Loading project index...</div>}>
          <ProjectFilterClient initialProjects={ordered} />
        </Suspense>
      </div>
    </main>
  );
}
