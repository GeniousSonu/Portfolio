import React from 'react';
import { PageShell, PageHeader, PageStub } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About — Operator Biography & Technical Philosophy',
  description: 'Background, patent achievements, leadership at Ib Arts and WEFIK, and full-stack engineering philosophy of SK Sahinur Islam (Genious Sonu).',
  path: '/about',
});

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ OPERATOR BIOGRAPHY ]"
        title="Engineering at the edge of systems & software."
        summary="A comprehensive narrative covering technical leadership at Ib Arts, co-founding WEFIK, patent achievements in solar IoT, and deep full-stack design philosophy."
      />
      <PageStub
        title="About Page Architecture"
        summary="The dedicated full-length biographical narrative is scheduled for deployment during Phase R1. In the interim, explore the executive summary on the Operator Console homepage."
        status="stub"
        routeHref="/about"
      />
    </PageShell>
  );
}
