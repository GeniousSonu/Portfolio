'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PlayPage() {
  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h1 className="section-title">Play With Me</h1>
        <p className="section-subtitle">Chess Bot, Stats & Challenges</p>

        <div style={{ marginTop: '3rem', display: 'grid', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>♟️ Lichess Bot Integration</h2>
                <p style={{ color: 'var(--text-muted)' }}>Challenge my automated chess engine (Currently undergoing maintenance, API integration pending).</p>
                <button className="btn btn-ghost" style={{ marginTop: '1rem' }} disabled>Challenge Bot (Offline)</button>
            </div>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎮 Game Stats</h2>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Valorant Tracker</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Diamond 2</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chess.com Rapid</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1650 ELO</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Request a Match</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Want to play a game? Send me a request and I&apos;ll get notified.</p>
                <a href="mailto:sahinurislamm2002@gmail.com?subject=Game Challenge" className="btn btn-gold">Send Challenge</a>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
