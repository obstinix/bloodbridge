import React from 'react';
import styles from './LiveBadge.module.css';

interface LiveBadgeProps {
  connected?: boolean;
  className?: string;
}

export default function LiveBadge({
  connected = true,
  className = '',
}: LiveBadgeProps) {
  return (
    <div
      className={`${styles.badge} ${
        connected ? styles.connected : styles.disconnected
      } ${className}`}
    >
      <span
        className={`${styles.dot} ${
          connected ? styles.dotConnected : styles.dotDisconnected
        }`}
      />
      <span>{connected ? 'Live' : 'Offline'}</span>
    </div>
  );
}
