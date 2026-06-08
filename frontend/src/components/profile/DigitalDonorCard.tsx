'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './DigitalDonorCard.module.css';

interface DigitalDonorCardProps {
  donorId: string;
  name: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  expiryDate?: string;
  className?: string;
}

export default function DigitalDonorCard({
  donorId,
  name,
  bloodType,
  expiryDate = '12/28',
  className = '',
}: DigitalDonorCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`${styles.perspective} ${className}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`${styles.flipCardInner} ${
          flipped ? styles.flipped : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className={styles.flipCardFront}>
          <svg className={styles.bgDropPattern} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>

          <div className={styles.topRow}>
            <div className={styles.logoArea}>
              <svg className={styles.logoIcon} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span className={styles.logoText}>
                <span className={styles.logoTextItalic}>Blood</span>Bridge
              </span>
            </div>
            <span className={styles.bloodType}>{bloodType}</span>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.donorMeta}>
              <span className={styles.name}>{name}</span>
              <span className={styles.badge}>Verified Donor</span>
            </div>
            <div className={styles.expirySection}>
              <span className={styles.expiryLabel}>Expires</span>
              <span className={styles.expiryDate}>{expiryDate}</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={styles.flipCardBack}>
          <div className={styles.backContent}>
            <div className={styles.qrWrapper}>
              <QRCodeSVG
                value={`https://bloodbridge.net/verify/donor/${donorId}`}
                size={80}
                bgColor="#FFFFFF"
                fgColor="#080808"
                level="M"
              />
            </div>
            <span className={styles.donorId}>{donorId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
