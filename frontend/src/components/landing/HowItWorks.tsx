'use client';

import React from 'react';
import { AlertCircle, UserCheck, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Patient/Hospital Request',
      description: 'A hospital or patient submits an emergency blood request with type and volume details.',
      icon: AlertCircle,
    },
    {
      step: '02',
      title: 'AI Matches Donors',
      description: 'Our system runs geospatial matching queries to locate nearby eligible donors instantly.',
      icon: UserCheck,
    },
    {
      step: '03',
      title: 'Delivery Confirmed',
      description: 'Matched donors respond, real-time tracking begins, and the blood reaches its destination.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[var(--color-surface)] dark:bg-[#1E293B] border-b border-border dark:border-border-dk scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-[var(--color-text)] dark:text-white tracking-tight">
            How BloodBridge Works
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-body max-w-xl mx-auto mt-3">
            A reliable 3-step pipeline designed to coordinate emergency blood requirements in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[var(--color-background)] dark:bg-[#0F172A] border border-border dark:border-border-dk rounded-card p-8 flex flex-col items-start"
              >
                {/* Step number badge */}
                <div className="absolute top-6 right-6 font-mono text-sm font-bold text-gray-400 dark:text-gray-600">
                  {item.step}
                </div>

                <div className="p-3 bg-[#A4161A]/10 text-[#A4161A] dark:text-[#F87171] rounded-[6px] mb-6">
                  <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                </div>

                <h3 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white mb-2">
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
