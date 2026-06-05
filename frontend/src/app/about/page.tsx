'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function AboutPage() {
  const milestones = [
    { phase: 'Phase 1', title: 'Local Registry', desc: 'Started as a simple blood bank database mapping regional stocks.' },
    { phase: 'Phase 2', title: 'Hospital Portals', desc: 'Introduced authenticated portals with JWT access for emergency coordinator units.' },
    { phase: 'Phase 3', title: 'Real-time Matching', desc: 'Launched live web sockets and automated donor matching notification relays.' },
    { phase: 'Phase 4', title: 'Operations Network', desc: 'Elevating into a decentralized state-wide emergency blood response grid.' },
  ];

  const team = [
    { initials: 'OB', name: 'Obstinix', role: 'Lead Architect / Designer' },
    { initials: 'AG', name: 'Antigravity AI', role: 'Co-Engineer' },
    { initials: 'ST', name: 'Stitch Integration', role: 'UX Optimizer' },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--color-background)] dark:bg-[#0F172A] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="text-center mb-16">
          <span className="text-xs font-heading font-semibold text-[#A4161A] dark:text-[#F87171] uppercase tracking-[0.2em] mb-4 block">
            ABOUT US
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] dark:text-white mb-6">
            Eliminating the Blood Supply Bottleneck.
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-4">
            BloodBridge was founded to bridge the critical gap between blood demand and volunteer supply. In medical emergencies, minutes save lives. Traditional logistics methods rely on phone lists and spreadsheets, creating delays that are completely unacceptable in the modern era.
          </p>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            By leveraging real-time data tracking, automated geospatial donor matching, and a robust verification pipeline, we coordinate connections between donors, hospitals, and blood banks to ensure the right unit gets to the right patient, instantly.
          </p>
        </section>

        {/* Timeline */}
        <section className="border-t border-border dark:border-border-dk pt-16 mb-16">
          <h2 className="font-heading font-semibold text-2xl text-[var(--color-text)] dark:text-white mb-8 text-center">
            Evolution Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-5 relative">
                <span className="text-[10px] font-mono font-bold text-[#A4161A] dark:text-[#FCA5A5] block mb-2">{m.phase}</span>
                <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white mb-2">{m.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-border dark:border-border-dk pt-16 mb-16 text-center">
          <h2 className="font-heading font-semibold text-2xl text-[var(--color-text)] dark:text-white mb-8">
            The Team
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#A4161A]/10 dark:bg-red-500/10 text-[#A4161A] dark:text-[#FCA5A5] flex items-center justify-center font-heading font-bold text-lg mb-3">
                  {t.initials}
                </div>
                <h4 className="text-sm font-semibold text-[var(--color-text)] dark:text-white">{t.name}</h4>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Call */}
        <section className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-8 text-center">
          <h3 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white mb-3">
            Ready to save lives?
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
            Register as a volunteer donor or join your healthcare institution to participate in real-time supply coordinates.
          </p>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
          >
            Create Profile
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
