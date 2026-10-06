import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Tools Portal — SK Sahinur Islam',
  description: 'Custom tools, generators, and JavaScript packages built by Genious Sonu.',
};

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h1 className="section-title">Developer Tools</h1>
        <p className="section-subtitle">Utilities, Generators & Packages</p>

        <div style={{ marginTop: '2rem' }}>
            <p>A collection of mini-tools and NPM packages I&apos;ve authored.</p>

            <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <a href="#" className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'block', textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--blue)' }}>JWT Decoder</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Secure client-side JWT inspection tool.</p>
                </a>
                <a href="#" className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'block', textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>Cron Generator</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Interactive UI to build complex cron expressions.</p>
                </a>
                <a href="#" className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'block', textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--emerald)' }}>@genious/utils (NPM)</h3>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>My personal javascript utility belt.</p>
                </a>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
