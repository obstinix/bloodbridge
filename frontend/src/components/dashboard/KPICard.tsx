'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function KPICard({
  title,
  value,
  delta,
  deltaLabel = 'vs last week',
  icon: IconComponent,
  trend = 'neutral',
  className,
}: KPICardProps) {
  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-[#A4161A] dark:text-[#FCA5A5]',
    neutral: 'text-gray-500 dark:text-gray-400',
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={cn(
        'bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 flex flex-col justify-between hover:shadow-card transition-shadow duration-150',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-heading">
          {title}
        </span>
        <IconComponent className="w-5 h-5 text-gray-400 dark:text-slate-500" strokeWidth={1.5} />
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-mono font-medium text-[var(--color-text)] dark:text-white tabular-nums tracking-tight">
          {value}
        </h3>
        {delta && (
          <div className="flex items-center gap-1 mt-1">
            <span className={cn('text-xs font-semibold', trendColors[trend])}>
              {delta}
            </span>
            <span className="text-[10px] text-gray-400">{deltaLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
