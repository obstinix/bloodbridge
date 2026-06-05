'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Routine';

interface UrgencyIndicatorProps {
  level: UrgencyLevel;
  className?: string;
}

export function getUrgencyRowClass(level: UrgencyLevel): string {
  switch (level) {
    case 'Critical':
      return 'border-l-4 border-l-red-600';
    case 'Urgent':
      return 'border-l-4 border-l-amber-500';
    case 'Routine':
      return 'border-l-4 border-l-gray-300 dark:border-l-gray-700';
    default:
      return '';
  }
}

export default function UrgencyIndicator({ level, className }: UrgencyIndicatorProps) {
  const configs = {
    Critical: {
      color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30',
      dot: 'bg-red-600',
      pulse: true,
    },
    Urgent: {
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30',
      dot: 'bg-amber-500',
      pulse: false,
    },
    Routine: {
      color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/30',
      dot: 'bg-gray-400',
      pulse: false,
    },
  };

  const current = configs[level] || configs['Routine'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded border transition-colors',
        current.color,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', current.dot)}></span>
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)}></span>
      </span>
      {level}
    </span>
  );
}
