'use client';

import React from 'react';
import BloodAvailabilityMap from '@/components/maps/BloodAvailabilityMap';

export default function MapPage() {
  return (
    <div className="space-y-6 font-body">
      {/* Top Stat Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4">
        <div className="text-center md:text-left md:border-r border-border dark:border-border-dk p-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Total Registered depots
          </span>
          <span className="font-mono text-2xl font-bold text-[#A4161A] dark:text-red-400">18</span>
        </div>
        <div className="text-center md:text-left md:border-r border-border dark:border-border-dk p-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Critical Shortage Regions
          </span>
          <span className="font-mono text-2xl font-bold text-amber-500">2</span>
        </div>
        <div className="text-center md:text-left p-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Active SOS coordinates
          </span>
          <span className="font-mono text-2xl font-bold text-red-600 animate-pulse">3</span>
        </div>
      </div>

      {/* Main Map Box */}
      <BloodAvailabilityMap />
    </div>
  );
}
