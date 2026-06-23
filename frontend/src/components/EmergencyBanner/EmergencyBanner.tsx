'use client';

import React from 'react';
import Link from 'next/link';
import styles from './EmergencyBanner.module.css';

export interface CriticalAlert {
  bloodType: string;
  units: number;
}

interface EmergencyBannerProps {
  alert: CriticalAlert;
  /** Auto-dismiss duration in milliseconds */
  dismissMs?: number;
  onDismiss: () => void;
  className?: string;
}

export default function EmergencyBanner({
  alert,
  dismissMs = 8000,
  onDismiss,
  className = '',
}: EmergencyBannerProps) {
  return (
    <div className={`${styles.banner} ${className}`}>
      <div className={styles.left}>
        <span className={styles.icon} aria-hidden="true">⚠️</span>
        <span>
          CRITICAL: <strong>{alert.bloodType}</strong> stock at{' '}
          <strong>{alert.units}</strong> units
        </span>
        <span className={styles.separator}>—</span>
        <Link href="/emergency" className={styles.ctaLink}>
          Respond Now →
        </Link>
      </div>

      <div className={styles.right}>
        <button
          onClick={onDismiss}
          className={styles.dismissBtn}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>

      {/* Progress bar that drains left-to-right over dismissMs */}
      <div
        className={styles.progressTrack}
        style={{ '--dismiss-duration': `${dismissMs}ms` } as React.CSSProperties}
      >
        <div className={styles.progressBar} />
      </div>
    </div>
  );
}
