import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'The Vault · Curations — SK Sahinur Islam',
  description: 'A curated list of my favorite movies, shows, songs, and articles.',
};

export default function VaultPage() {
  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h1 className="section-title">The Vault</h1>
        <p className="section-subtitle">Curated Favorites: Movies, Shows, & Sounds</p>

        <div style={{ marginTop: '3rem', display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

          <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>🎬 Movies & Shows</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
              <li>Mr. Robot</li>
              <li>The Matrix</li>
              <li>Silicon Valley</li>
              <li>Interstellar</li>
              <li>The Social Network</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--emerald)' }}>🎵 Sounds</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
              <li>Lofi Girl (Synthwave)</li>
              <li>Hans Zimmer Soundtracks</li>
              <li>Daft Punk - Tron Legacy</li>
            </ul>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
