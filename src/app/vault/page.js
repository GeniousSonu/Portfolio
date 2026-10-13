import React from 'react';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import styles from './vault.module.css';

export const metadata = buildMetadata({
  title: 'The Vault — Curated Archives of Cinema, Literature & Sound',
  description:
    'Curated collection of influential engineering literature, seminal cinema, electronic soundtracks, and design philosophies that shape the thinking of SK Sahinur Islam.',
  path: '/vault',
});

const VAULT_CATEGORIES = [
  {
    id: 'cinema',
    tag: 'Cinema & Television',
    items: [
      {
        title: 'Mr. Robot',
        creator: 'Sam Esmail',
        year: '2015–2019',
        desc: 'Uncompromising depiction of cybersecurity, Linux terminals, social engineering, and corporate fragility.',
        tags: ['Cybersecurity', 'Linux', 'Social Engineering'],
      },
      {
        title: 'The Matrix',
        creator: 'The Wachowskis',
        year: '1999',
        desc: 'The definitive philosophical manifesto on simulation hypothesis, cyberpunk aesthetics, and human agency.',
        tags: ['Cyberpunk', 'Simulation', 'Sci-Fi'],
      },
      {
        title: 'Silicon Valley',
        creator: 'Mike Judge',
        year: '2014–2019',
        desc: 'Painfully accurate satire of compression algorithms, distributed peer-to-peer nets, and venture-backed startup chaos.',
        tags: ['Distributed Systems', 'Compression', 'Startups'],
      },
      {
        title: 'Interstellar',
        creator: 'Christopher Nolan',
        year: '2014',
        desc: 'A masterclass in theoretical physics, relativistic mechanics, gravitational time dilation, and emotional resonance.',
        tags: ['General Relativity', 'Physics', 'Space'],
      },
      {
        title: 'The Social Network',
        creator: 'David Fincher',
        year: '2010',
        desc: 'Frenetic, razor-sharp exploration of rapid Apache server orchestration, algorithm architecture, and ambitious creation.',
        tags: ['System Architecture', 'Algorithms', 'Founders'],
      },
      {
        title: 'Dark',
        creator: 'Baran bo Odar & Jantje Friese',
        year: '2017–2020',
        desc: 'Intricate, non-linear causal loop topology and determinism executed with flawless structural precision.',
        tags: ['Topology', 'Determinism', 'Non-linear'],
      },
    ],
  },
  {
    id: 'literature',
    tag: 'Seminal Literature & Systems Books',
    items: [
      {
        title: 'Designing Data-Intensive Applications',
        creator: 'Martin Kleppmann',
        year: 'Book',
        desc: 'The indispensable guide to storage engines, distributed consensus, transactions, replication, and partitioning.',
        tags: ['Distributed Systems', 'Databases', 'Consensus'],
      },
      {
        title: 'The Phoenix Project',
        creator: 'Gene Kim, Kevin Behr, George Spafford',
        year: 'Book',
        desc: 'Crucial narrative on the Three Ways of DevOps, Theory of Constraints, flow optimization, and feedback loops.',
        tags: ['DevOps', 'Operations', 'Continuous Delivery'],
      },
      {
        title: 'Clean Architecture',
        creator: 'Robert C. Martin',
        year: 'Book',
        desc: 'Dependency inversion, boundary enforcement, ports-and-adapters architecture, and domain isolation.',
        tags: ['Architecture', 'Software Design', 'Decoupling'],
      },
      {
        title: 'Applied Cryptography',
        creator: 'Bruce Schneier',
        year: 'Book',
        desc: 'Foundational text covering symmetric ciphers, public-key infrastructure, digital signatures, and protocol design.',
        tags: ['Cryptography', 'Security', 'Protocols'],
      },
      {
        title: 'The Linux Programming Interface',
        creator: 'Michael Kerrisk',
        year: 'Reference',
        desc: 'Definitive deep dive into Linux system calls, POSIX threads, IPC mechanisms, signals, and kernel interfaces.',
        tags: ['Linux Kernel', 'POSIX', 'Systems Programming'],
      },
    ],
  },
  {
    id: 'sound',
    tag: 'Frequencies & Soundtracks',
    items: [
      {
        title: 'TRON: Legacy (Original Motion Picture Soundtrack)',
        creator: 'Daft Punk',
        year: 'Album',
        desc: 'Orchestral electronic masterpiece built on modular synthesizers, driving arpeggios, and futuristic spatial textures.',
        tags: ['Synthwave', 'Orchestral', 'Cyberpunk'],
      },
      {
        title: 'Interstellar OST',
        creator: 'Hans Zimmer',
        year: 'Score',
        desc: 'Majestic organ-driven acoustic textures exploring isolation, relentless time ticking, and cosmic wonder.',
        tags: ['Pipe Organ', 'Ambient', 'Focus'],
      },
      {
        title: 'The Social Network OST',
        creator: 'Trent Reznor & Atticus Ross',
        year: 'Album',
        desc: 'Dark ambient electronics, metallic drone textures, and mechanical focus-state rhythms for deep coding flow.',
        tags: ['Industrial', 'Dark Ambient', 'Flow State'],
      },
      {
        title: 'Blade Runner 2049 OST',
        creator: 'Hans Zimmer & Benjamin Wallfisch',
        year: 'Score',
        desc: 'Yamaha CS-80 synthesizer sub-bass, neon brass, and atmospheric cyber acoustics.',
        tags: ['Vangelis Heritage', 'Sub-Bass', 'Cinema'],
      },
      {
        title: 'Lofi Terminal & Cyber Synthwave Stations',
        creator: 'Curated Radio Streams',
        year: 'Continuous',
        desc: 'Continuous non-intrusive instrumental rhythms calibrated for 12-hour terminal and architecture sessions.',
        tags: ['Low-Fi', 'Coding Audio', 'Instrumental'],
      },
    ],
  },
];

export default function VaultPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ CULTURAL REPOSITORY · ARCHIVE ]"
        title="The Vault — Curated Media & Knowledge"
        summary="An indexed collection of the cinematic masterworks, architectural literature, and electronic frequencies that define my creative worldview and systems thinking."
      />

      <Section className={styles.wrapper}>
        <Container>
          <div className={styles.intro}>
            <p className={styles.introText}>
              Great engineering is never forged in isolation. It is inspired by stories of daring creation,
              mathematical rigor, foundational system blueprints, and the acoustic textures that power deep flow states.
            </p>
          </div>

          <div className={styles.vaultGrid}>
            {VAULT_CATEGORIES.map((cat) => (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryTag}>{cat.tag}</span>
                  <span className={styles.categoryCount}>{cat.items.length} records</span>
                </div>

                <ul className={styles.itemList}>
                  {cat.items.map((item) => (
                    <li key={item.title} className={styles.vaultItem}>
                      <div className={styles.itemTop}>
                        <div className={styles.itemTitle}>{item.title}</div>
                        <div className={styles.itemMeta}>{item.year}</div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--signal, var(--gold))', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                        {item.creator}
                      </div>
                      <p className={styles.itemDesc}>{item.desc}</p>
                      <div className={styles.itemTags}>
                        {item.tags.map((t) => (
                          <span key={t} className={styles.tagPill}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
