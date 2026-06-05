'use client';

import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
}

function StatItem({ value, suffix = '', label }: StatItemProps) {
  const { ref, count } = useCountUp(value, 1500);

  return (
    <div ref={ref as any} className="flex flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-3xl md:text-4xl font-bold text-[#A4161A] dark:text-[#FCA5A5] tabular-nums mb-1">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="font-body text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="w-full bg-surface dark:bg-[#1E293B] border-t border-b border-border dark:border-border-dk">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border dark:divide-border-dk">
        <StatItem value={47283} suffix="+" label="Active Donors" />
        <StatItem value={312} label="Registered Hospitals" />
        <StatItem value={1200000} suffix="+" label="Units Delivered" />
        <StatItem value={89421} label="Lives Saved" />
      </div>
    </div>
  );
}
