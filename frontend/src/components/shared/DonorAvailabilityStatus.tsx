'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type AvailabilityStatus = 'Available' | 'Busy' | 'Traveling' | 'Ready to Donate' | 'On Leave';

interface DonorAvailabilityStatusProps {
  status: AvailabilityStatus;
  isEditable?: boolean;
  onChange?: (status: AvailabilityStatus) => void;
  className?: string;
}

export default function DonorAvailabilityStatus({
  status,
  isEditable = false,
  onChange,
  className,
}: DonorAvailabilityStatusProps) {
  const configs = {
    'Available': {
      dot: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-400',
      pulse: false,
    },
    'Ready to Donate': {
      dot: 'bg-green-500',
      text: 'text-green-700 dark:text-green-400',
      pulse: true,
    },
    'Busy': {
      dot: 'bg-gray-400 dark:bg-gray-500',
      text: 'text-gray-600 dark:text-gray-400',
      pulse: false,
    },
    'Traveling': {
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
      pulse: false,
    },
    'On Leave': {
      dot: 'bg-slate-400 dark:bg-slate-500',
      text: 'text-slate-500 dark:text-slate-400',
      pulse: false,
    },
  };

  const current = configs[status] || configs['Busy'];

  if (isEditable && onChange) {
    return (
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as AvailabilityStatus)}
        className={cn(
          'text-xs bg-transparent border border-border dark:border-border-dk rounded px-2 py-1 outline-none font-medium',
          current.text,
          className
        )}
      >
        <option value="Available">🟢 Available</option>
        <option value="Ready to Donate">🟢 Ready to Donate</option>
        <option value="Busy">⚫ Busy</option>
        <option value="Traveling">🟡 Traveling</option>
        <option value="On Leave">⚪ On Leave</option>
      </select>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-semibold', current.text, className)}>
      <span className="relative flex h-2.5 w-2.5">
        {current.pulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', current.dot)}></span>
        )}
        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', current.dot)}></span>
      </span>
      {status}
    </span>
  );
}
