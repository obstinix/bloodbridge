'use client';

import React from 'react';
import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="py-20 bg-[#A4161A] dark:bg-[#660708] text-white relative overflow-hidden">
      {/* Background SVG Grid accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-display font-bold text-3xl md:text-5xl mb-4 leading-tight">
          Every Unit Saved Is a Life Extended.
        </h2>
        <p className="font-body text-sm md:text-base text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
          Join the decentralized operations network today and help eliminate the emergency response bottleneck.
        </p>
        <div className="flex flex-row justify-center items-center gap-3">
          <Link
            href="/register"
            className="px-5 py-3 bg-white text-[#A4161A] dark:text-[#660708] rounded-[6px] text-sm font-semibold hover:bg-gray-100 hover:translate-y-[-1px] transition-all shadow-sm"
          >
            Join as Donor
          </Link>
          <Link
            href="/register?role=hospital"
            className="px-5 py-3 border border-white text-white rounded-[6px] text-sm font-semibold hover:bg-white/10 hover:translate-y-[-1px] transition-all"
          >
            Register Hospital
          </Link>
        </div>
      </div>
    </section>
  );
}
