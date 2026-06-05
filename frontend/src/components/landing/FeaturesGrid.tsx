'use client';

import React from 'react';
import { Map, Brain, Siren, Flame, Calendar, ShieldAlert } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Live Blood Map',
      description: 'Real-time blood stock availability mapped across all registered blood banks and hospitals.',
      icon: Map,
    },
    {
      title: 'AI Donor Matching',
      description: 'Intelligent matchmaking engine parsing blood type compatibilities, distance, and eligibility counters.',
      icon: Brain,
    },
    {
      title: 'SOS Alert System',
      description: 'One-tap emergency SOS broadcasts notifying all compatible active donors in the immediate vicinity.',
      icon: Siren,
    },
    {
      title: 'Donation Streaks',
      description: 'Gamified retention system tracking donor streaks, calendar heatmaps, and achievement badges.',
      icon: Flame,
    },
    {
      title: 'Blood Drive Manager',
      description: 'Coordinate, schedule, and register attendees at regional donation camps with real-time QR check-ins.',
      icon: Calendar,
    },
    {
      title: 'Rare Blood Registry',
      description: 'Dedicated priority routing network for rare groups like Bombay Blood Group and Rh-null.',
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="features" className="py-20 bg-[var(--color-background)] dark:bg-[#0F172A] border-b border-border dark:border-border-dk scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-[var(--color-text)] dark:text-white tracking-tight">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-body max-w-xl mx-auto mt-3">
            A comprehensive Operations Center package built for robust healthcare logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 hover:translate-y-[-2px] hover:shadow-card transition-all duration-200"
              >
                <div className="p-2.5 bg-[#A4161A]/10 text-[#A4161A] dark:text-[#FCA5A5] rounded-[6px] w-fit mb-4">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-semibold text-base text-[var(--color-text)] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
