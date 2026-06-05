'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsBar from '@/components/landing/StatsBar';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import EmergencyDemo from '@/components/landing/EmergencyDemo';
import Testimonials from '@/components/landing/Testimonials';
import CTABanner from '@/components/landing/CTABanner';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--color-background)] dark:bg-[#0F172A] flex flex-col font-body">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <EmergencyDemo />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
