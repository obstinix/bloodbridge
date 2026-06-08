'use client';

import React from 'react';
import { Award, ShieldAlert, Star, Trophy, Flame } from 'lucide-react';
import styles from './BadgeGrid.module.css';

interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

interface BadgeGridProps {
  className?: string;
}

export default function BadgeGrid({ className = '' }: BadgeGridProps) {
  const badges: Badge[] = [
    {
      id: 'badge-1',
      name: 'First Drop',
      description: 'Completed your first blood donation',
      unlocked: true,
      icon: <Star size={20} />,
    },
    {
      id: 'badge-2',
      name: 'Life Saver',
      description: 'Helped save up to 15 lives',
      unlocked: true,
      icon: <Award size={20} />,
    },
    {
      id: 'badge-3',
      name: 'Streak Hero',
      description: 'Maintained 3 consecutive cycles',
      unlocked: true,
      icon: <Flame size={20} />,
    },
    {
      id: 'badge-4',
      name: 'Red Cross Elite',
      description: 'Completed 10 total donations',
      unlocked: false,
      icon: <Trophy size={20} />,
    },
    {
      id: 'badge-5',
      name: 'Rare Champion',
      description: 'Universal or rare type routing champion',
      unlocked: false,
      icon: <ShieldAlert size={20} />,
    },
  ];

  return (
    <div className={`${styles.container} ${className}`}>
      <h3 className={styles.title}>Achievements & Milestones</h3>
      <div className={styles.grid}>
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`${styles.card} ${
              badge.unlocked ? styles.unlocked : styles.locked
            }`}
          >
            <div className={styles.iconWrapper}>
              {badge.icon}
            </div>
            <span className={styles.name}>{badge.name}</span>
            <span className={styles.desc}>{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
