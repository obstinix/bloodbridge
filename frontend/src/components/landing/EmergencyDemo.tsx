'use client';

import React from 'react';
import SOSSpreadAnimation from './SOSSpreadAnimation';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';

export default function EmergencyDemo() {
  return (
    <section className="py-20 bg-surface dark:bg-[#1E293B] border-b border-border dark:border-border-dk">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left column: Text details */}
        <div>
          <span className="text-xs md:text-sm font-heading font-semibold text-[#A4161A] dark:text-[#F87171] uppercase tracking-[0.2em] mb-4 block">
            AI-POWERED MATCHMAKING
          </span>
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-[var(--color-text)] dark:text-white leading-tight mb-6 tracking-tight">
            Geospatial SOS Alert Propagation
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-body mb-6 leading-relaxed">
            When a hospital submits a critical SOS request, BloodBridge calculates compatible matches in a growing radius. In seconds, eligible donors receive priority notifications directly on their devices.
          </p>
          <div className="bg-[var(--color-background)] dark:bg-[#0F172A] border border-border dark:border-border-dk rounded-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#A4161A] animate-pulse"></span>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                ACTIVE EMERGENCIES NEARBY
              </span>
            </div>
            {/* Mock Alert Card */}
            <div className="bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded p-4 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group="O+" size="md" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--color-text)] dark:text-white">O+ Whole Blood Needed</h4>
                  <p className="text-[10px] text-gray-400">City Hospital • 1.2km away</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold block">
                  RESPOND IN 08:24
                </span>
                <span className="text-[9px] text-gray-500">2 units required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Graphic animation */}
        <div className="w-full flex justify-center">
          <SOSSpreadAnimation />
        </div>
      </div>
    </section>
  );
}
