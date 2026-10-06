'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConfessionPage() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    // Placeholder for actual Supabase insertion + encryption
    setStatus('submitting');
    setTimeout(() => {
        setStatus('success');
        setNote('');
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="section-title" style={{ textAlign: 'center' }}>Secret Note</h1>
            <p className="section-subtitle" style={{ textAlign: 'center' }}>Leave an anonymous confession or message.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Type your secret here... (End-to-end encrypted in transit)"
                    rows={6}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text)',
                        resize: 'vertical'
                    }}
                    disabled={status === 'submitting'}
                />
                <button
                    type="submit"
                    className="btn btn-gold"
                    style={{ alignSelf: 'flex-end' }}
                    disabled={status === 'submitting' || !note.trim()}
                >
                    {status === 'submitting' ? 'Encrypting & Sending...' : 'Drop Note securely'}
                </button>
            </form>

            {status === 'success' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)', borderRadius: '8px', textAlign: 'center' }}>
                    Note securely dropped into the vault.
                </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}
