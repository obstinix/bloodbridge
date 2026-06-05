'use client';

import React from 'react';
import { BloodGroup, BLOOD_GROUP_COLORS } from '@/constants/bloodGroups';
import { cn } from '@/lib/utils';

interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BloodGroupBadge({ group, size = 'md', className }: BloodGroupBadgeProps) {
  const colors = BLOOD_GROUP_COLORS[group] || { bg: '#F3F4F6', text: '#1F2937', dark: '#F9FAFB' };

  const sizeStyles = {
    sm: 'h-6 px-2 text-[10px]',
    md: 'h-8 px-3 text-xs',
    lg: 'h-12 px-5 text-lg',
  };

  return (
    <span
      style={{ backgroundColor: colors.bg, color: colors.text }}
      className={cn(
        'inline-flex items-center justify-center font-mono font-semibold rounded-badge border border-black/5 dark:border-white/5 transition-colors',
        sizeStyles[size],
        className
      )}
    >
      {group}
    </span>
  );
}
