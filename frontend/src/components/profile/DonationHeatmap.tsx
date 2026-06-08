'use client';

import React, { useMemo } from 'react';
import styles from './DonationHeatmap.module.css';

interface DonationHeatmapProps {
  className?: string;
}

export default function DonationHeatmap({
  className = '',
}: DonationHeatmapProps) {
  // Generate a mock grid of 53 weeks * 7 days = 371 squares
  const squares = useMemo(() => {
    const arr = [];
    const donationDays = [12, 45, 98, 142, 210, 275, 330]; // Specific days of donation

    for (let i = 0; i < 371; i++) {
      let level = 0;
      if (donationDays.includes(i)) {
        level = 4; // Donation Day
      } else if (donationDays.some((d) => Math.abs(d - i) < 3)) {
        level = 2; // Recovery check-ups or appointments nearby
      } else if (Math.random() < 0.08) {
        level = 1; // Activity details
      }
      arr.push(level);
    }
    return arr;
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Donation Activity Calendar</h3>
          <span className={styles.subtitle}>
            Your donation streaks and check-in history mapped over the past year
          </span>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <div className={styles.grid}>
          {squares.map((level, idx) => (
            <div
              key={idx}
              className={`${styles.square} ${styles[`level${level}`]}`}
              title={`Day ${idx + 1}: Level ${level} activity`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span>Less</span>
        <div className={styles.legendSquares}>
          <div className={`${styles.square} ${styles.level0}`} />
          <div className={`${styles.square} ${styles.level1}`} />
          <div className={`${styles.square} ${styles.level2}`} />
          <div className={`${styles.square} ${styles.level3}`} />
          <div className={`${styles.square} ${styles.level4}`} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
