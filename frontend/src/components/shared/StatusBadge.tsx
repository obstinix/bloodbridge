'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Pending' | 'Matched' | 'In Transit' | 'Fulfilled' | 'Cancelled' | 'Critical';
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const configs = {
    'Pending': {
      bg: 'bg-[#FEF3C7] dark:bg-[#78350F]/20',
      text: 'text-[#92400E] dark:text-[#FBBF24]',
      dot: 'bg-[#F59E0B]',
      pulse: false,
    },
    'Matched': {
      bg: 'bg-[#E0E7FF] dark:bg-[#312E81]/20',
      text: 'text-[#3730A3] dark:text-[#C7D2FE]',
      dot: 'bg-[#6366F1]',
      pulse: false,
    },
    'In Transit': {
      bg: 'bg-[#FEE2E2] dark:bg-[#7F1D1D]/20',
      text: 'text-[#A4161A] dark:text-[#FCA5A5]',
      dot: 'bg-[#EF4444]',
      pulse: true,
    },
    'Fulfilled': {
      bg: 'bg-[#D1FAE5] dark:bg-[#064E3B]/20',
      text: 'text-[#2D6A4F] dark:text-[#34D399]',
      dot: 'bg-[#10B981]',
      pulse: false,
    },
    'Cancelled': {
      bg: 'bg-[#F3F4F6] dark:bg-[#374151]/20',
      text: 'text-[#6B7280] dark:text-[#9CA3AF]',
      dot: 'bg-[#9CA3AF]',
      pulse: false,
    },
    'Critical': {
      bg: 'bg-[#FEE2E2] dark:bg-[#7F1D1D]/30',
      text: 'text-[#DC2626] dark:text-[#F87171]',
      dot: 'bg-[#DC2626]',
      pulse: true,
    },
  };

  const current = configs[status] || configs['Pending'];
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-badge border border-black/[0.03] dark:border-white/[0.03] transition-colors',
        current.bg,
        current.text,
        sizeStyles,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', current.dot)}></span>
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)}></span>
      </span>
      {status}
    </span>
  );
}
