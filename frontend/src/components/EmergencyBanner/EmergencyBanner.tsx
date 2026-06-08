import React from 'react';
import Link from 'next/link';
import styles from './EmergencyBanner.module.css';

export interface EmergencyAlert {
  id: string;
  bloodType: string;
  hospital: string;
  severity: 'critical' | 'urgent';
  unitsNeeded: number;
}

interface EmergencyBannerProps {
  alerts: EmergencyAlert[];
  onDismiss: (id: string) => void;
  className?: string;
}

export default function EmergencyBanner({
  alerts,
  onDismiss,
  className = '',
}: EmergencyBannerProps) {
  if (alerts.length === 0) return null;

  const currentAlert = alerts[0];

  return (
    <div className={`${styles.banner} ${className}`}>
      <div className={styles.left}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          CRITICAL SHORTAGE — {currentAlert.bloodType} Blood needed at {currentAlert.hospital} ({currentAlert.unitsNeeded} units)
        </span>
        {alerts.length > 1 && (
          <span className={styles.stackIndicator}>
            +{alerts.length - 1} more alerts
          </span>
        )}
      </div>

      <div className={styles.right}>
        <Link href="/emergency" className={styles.actionBtn}>
          View Requests
        </Link>
        <button
          onClick={() => onDismiss(currentAlert.id)}
          className={styles.dismissBtn}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
