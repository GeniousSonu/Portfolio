import React from 'react';
import ContactView from './ContactView';

export const metadata = {
  title: 'Contact — SK Sahinur Islam',
  description:
    'Send a message to SK Sahinur Islam for software engineering projects, backend architecture, server administration, or general inquiries.',
  openGraph: {
    title: 'Contact — SK Sahinur Islam',
    description:
      'Send a message to SK Sahinur Islam for software engineering projects, backend architecture, or general inquiries.',
    url: 'https://genioussonu.me/contact',
    siteName: 'SK Sahinur Islam',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — SK Sahinur Islam',
    description:
      'Send a message to SK Sahinur Islam for software engineering projects or general inquiries.',
    creator: '@GeniousSonu',
  },
  alternates: {
    canonical: 'https://genioussonu.me/contact',
  },
};

export default function ContactPage() {
  return <ContactView />;
}
