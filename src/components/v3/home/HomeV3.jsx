'use client';

import React from 'react';
import ChapterRail from '../ChapterRail';
import StudioDock from '../StudioDock';
import HeroV3 from './HeroV3';
import AboutV3 from './AboutV3';
import ExperienceV3 from './ExperienceV3';
import ProjectsV3 from './ProjectsV3';
import SkillsV3 from './SkillsV3';
import CertificationsV3 from './CertificationsV3';
import ReachV3 from './ReachV3';
import BlogV3 from './BlogV3';
import ContactV3 from './ContactV3';

export default function HomeV3() {
  return (
    <div className="v3" data-v3-page="home">
      <a className="v3-skip" href="#main-content">
        Skip to content
      </a>

      <ChapterRail />
      <StudioDock />

      <main id="main-content" className="v3-main" data-route="/">
        <HeroV3 />
        <AboutV3 />
        <ExperienceV3 />
        <ProjectsV3 />
        <SkillsV3 />
        <CertificationsV3 />
        <ReachV3 />
        <BlogV3 />
        <ContactV3 />
      </main>
    </div>
  );
}
