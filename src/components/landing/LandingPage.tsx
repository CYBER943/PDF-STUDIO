import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingWhy } from './LandingWhy';
import { LandingFeatures } from './LandingFeatures';
import { LandingHowItWorks } from './LandingHowItWorks';
import { LandingLibraryVision } from './LandingLibraryVision';
import { LandingRecovery } from './LandingRecovery';
import { LandingSecurity } from './LandingSecurity';
import { LandingRoadmap } from './LandingRoadmap';
import { LandingFAQ } from './LandingFAQ';
import { LandingContact } from './LandingContact';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onOpenAuth: () => void;
  onEnterApp: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'cookies' | 'beta' | 'security' | 'contact') => void;
  onOpenBetaModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onEnterApp,
  onOpenLegal,
  onOpenBetaModal,
}) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <LandingNavbar
        onOpenAuth={onOpenAuth}
        onEnterApp={onEnterApp}
        onOpenLegal={onOpenLegal}
      />

      {/* Hero Section with Product Mockup & Development Status */}
      <LandingHero
        onGetStarted={onEnterApp}
        onExploreFeatures={() => {
          const el = document.getElementById('features');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onLearnDevelopment={() => {
          const el = document.getElementById('roadmap');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Problem & Solution: Why PDF Studio? */}
      <LandingWhy onEnterApp={onEnterApp} />

      {/* Structured Categorized Feature Grid with Status Badges */}
      <LandingFeatures />

      {/* How it Works: 4-step sequence */}
      <LandingHowItWorks />

      {/* Personal PDF Library Vision */}
      <LandingLibraryVision onEnterApp={onEnterApp} />

      {/* Recovery Vault & Transparent Lifecycle */}
      <LandingRecovery />

      {/* Security & Privacy Architecture */}
      <LandingSecurity />

      {/* Development Roadmap */}
      <LandingRoadmap onEnterApp={onEnterApp} />

      {/* Frequently Asked Questions */}
      <LandingFAQ />

      {/* Early Feedback & Contact Form */}
      <LandingContact />

      {/* Complete Footer */}
      <LandingFooter
        onOpenAuth={onOpenAuth}
        onOpenLegal={onOpenLegal}
        onEnterApp={onEnterApp}
      />
    </div>
  );
};
