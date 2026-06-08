'use client';

import React, { useState } from 'react';
import styles from './MapMarker.module.css';

interface MapMarkerProps {
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  urgency: 'critical' | 'urgent' | 'standard';
  className?: string;
}

export default function MapMarker({
  title,
  subtitle,
  urgency,
  className = '',
}: MapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);

  let pinClass = styles.adequatePin;
  let pulseClass = '';

  if (urgency === 'critical') {
    pinClass = styles.criticalPin;
    pulseClass = styles.pulseRing;
  } else if (urgency === 'urgent') {
    pinClass = styles.lowPin;
    pulseClass = `${styles.pulseRing} ${styles.pulseRingUrgent}`;
  }

  return (
    <div
      className={`${styles.markerWrapper} ${className}`}
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
      onClick={() => setShowPopup(!showPopup)}
    >
      {/* Heartbeat pulse ring */}
      {pulseClass && <div className={pulseClass} />}

      {/* Main Pin */}
      <div className={`${styles.pin} ${pinClass}`} />

      {/* Tooltip Popup */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupTitle}>{title}</div>
          {subtitle && <div className={styles.popupMeta}>{subtitle}</div>}
        </div>
      )}
    </div>
  );
}
