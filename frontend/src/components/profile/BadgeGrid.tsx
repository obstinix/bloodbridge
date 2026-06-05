import React from 'react';
import { BADGE_DEFINITIONS } from '@/constants/badges';

interface BadgeGridProps {
  unlockedBadges: string[];
}

export default function BadgeGrid({ unlockedBadges }: BadgeGridProps) {
  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm">
      <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
        Achievement Badges
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BADGE_DEFINITIONS.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`p-3 rounded border text-center flex flex-col items-center gap-1.5 transition-all ${
                isUnlocked 
                  ? 'border-red-200 dark:border-red-950/30 bg-red-50/50 dark:bg-red-950/10' 
                  : 'border-border dark:border-border-dk opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[10px] font-bold text-[var(--color-text)] dark:text-white block truncate w-full">
                {badge.name}
              </span>
              <span className="text-[8px] font-mono text-gray-400 block">
                {badge.tier} Tier
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
