import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Wiki — SK Sahinur Islam',
  description: 'Digital garden and personal knowledge base of SK Sahinur Islam.',
};

export default function WikiPage() {
  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h1 className="section-title">Personal Wiki</h1>
        <p className="section-subtitle">Digital Garden & Knowledge Base</p>

        <div style={{ marginTop: '2rem' }}>
          <p>This is where I document my learnings, system architectures, and technical deep-dives.</p>

          <ul style={{ marginTop: '2rem', listStyleType: 'none', padding: 0 }}>
            <li style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ color: 'var(--text)' }}>IoT Real-Time Vaccine Storage Monitoring</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patent Details & Architecture Breakdown</p>
            </li>
            <li style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ color: 'var(--text)' }}>Scaling Next.js on Vercel</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ISR, Caching strategies, and Edge middleware.</p>
            </li>
            <li style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ color: 'var(--text)' }}>WebRTC P2P Topologies</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mesh vs Star topology implementations in JS.</p>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
