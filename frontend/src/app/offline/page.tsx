'use client';

import React from 'react';
import Button from '@/components/Button/Button';
import styles from './offline.module.css';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="var(--crimson)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          </svg>
        </div>
        <h1 className={styles.title}>No Connection</h1>
        <p className={styles.body}>
          BloodBridge requires an active connection to deliver real-time emergency data.
          Check your network and try again.
        </p>
        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Offline — reconnecting automatically</span>
        </div>
        <Button variant="primary" onClick={handleRetry}>Retry Connection</Button>
        <p className={styles.note}>
          If you have a cached session, some features may be available offline.
        </p>
      </div>
    </div>
  );
}
