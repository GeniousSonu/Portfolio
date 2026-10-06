import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'WEFIK · Startups & Ventures — SK Sahinur Islam',
  description: 'Detailed showcase of WEFIK, my startup. Exploring the architecture, growth, and the 30+ applications delivered globally.',
};

export default function WefikPage() {
  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <h1 className="section-title">WEFIK (Web Era for Innovation & Knowledge)</h1>
        <p className="section-subtitle">Co-Founder & Lead Engineer</p>
        <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>
          <p>
            Founded in March 2021, WEFIK is a technology agency specializing in building scalable web and mobile applications for international clients.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>Scale & Impact:</strong> We have successfully directed end-to-end technical delivery for over 30 international projects.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>My Role:</strong> As a Co-Founder, I architect the backend systems, manage cloud infrastructure (AWS/GCP), and oversee the entire software development lifecycle to ensure high availability and performance.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
