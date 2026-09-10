import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactView from './ContactView';

export const metadata = {
  title: 'Establish Connection · Terminal Handshake — SK Sahinur Islam',
  description:
    'Direct terminal handshake, secure transmission protocol, and low-latency communication channel to SK Sahinur Islam (Genious Sonu). Engineering contracts, architectural consulting, and full stack inquiries.',
  openGraph: {
    title: 'Establish Connection — SK Sahinur Islam (Genious Sonu)',
    description:
      'Direct terminal handshake, secure transmission protocol, and low-latency communication channel to SK Sahinur Islam (Genious Sonu).',
    url: 'https://genioussonu.me/contact',
    siteName: 'SK Sahinur Islam (Genious Sonu)',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Establish Connection · SK Sahinur Islam',
    description: 'Low-latency direct terminal handshake and encrypted communication channel to SK Sahinur Islam.',
    creator: '@GeniousSonu',
  },
  alternates: {
    canonical: 'https://genioussonu.me/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactView />
      <Footer />
    </>
  );
}
