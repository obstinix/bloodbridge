'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[var(--color-background)] dark:bg-[#0F172A]">
      {/* Dot grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-black dark:text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <span className="text-xs md:text-sm font-heading font-semibold text-[#A4161A] dark:text-[#F87171] uppercase tracking-[0.2em] mb-4">
          Real-Time Emergency Network
        </span>

        {/* Headline */}
        <h1 className="font-display font-bold text-4xl md:text-6xl text-[var(--color-text)] dark:text-white leading-[1.1] mb-6 max-w-3xl whitespace-pre-line tracking-tight">
          When Every Minute Counts,{'\n'}Blood Shouldn&apos;t Be the Bottleneck.
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 font-body font-normal max-w-2xl mb-8 leading-relaxed">
          AI-matched donors. Live inventory maps. One-tap SOS alerts connecting hospitals, donors, and blood banks instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-row items-center gap-3 mb-12">
          <Link
            href="/register"
            className="px-5 py-3 bg-[#A4161A] text-white rounded-[6px] text-sm font-semibold hover:bg-[#660708] hover:translate-y-[-1px] transition-all shadow-sm"
          >
            Register as Donor
          </Link>
          <Link
            href="/emergency"
            className="px-5 py-3 border border-[#E5383B] dark:border-[#F87171] text-[#A4161A] dark:text-[#F87171] rounded-[6px] text-sm font-semibold hover:bg-[#E5383B]/5 dark:hover:bg-[#F87171]/5 hover:translate-y-[-1px] transition-all"
          >
            Request Blood Now
          </Link>
        </div>

        {/* Animated Heartbeat Line */}
        <div className="relative w-40 h-8 flex items-center justify-center opacity-30 dark:opacity-20 mt-4">
          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path
              d="M0 10 h40 l3 -8 l3 16 l3 -12 l3 4 h48"
              fill="none"
              stroke="#A4161A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="path-pulse"
            />
          </svg>
          <style jsx>{`
            .path-pulse {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
              animation: dash 4s linear infinite;
            }
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
