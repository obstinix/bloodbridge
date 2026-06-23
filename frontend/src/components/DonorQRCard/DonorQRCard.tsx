'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import BloodTypeBadge, { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import Button from '../Button/Button';
import { useCardTilt } from '@/hooks/useCardTilt';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './DonorQRCard.module.css';

interface DonorQRCardProps {
  donorId: string;
  name: string;
  bloodType: BloodType;
  expiryDate?: string;
  className?: string;
}

export default function DonorQRCard({
  donorId,
  name,
  bloodType,
  expiryDate = '12/26',
  className = '',
}: DonorQRCardProps) {
  const tilt = useCardTilt(6);
  const revealRef = useScrollReveal();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      ref={revealRef as any}
      className={`${styles.cardContainer} reveal reveal-scale ${className}`}
    >
      {/* Holographic identity card */}
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`${styles.card} tilt-card`}
      >
        <div className={styles.cardStripe} />
        <span className={styles.watermark}>{bloodType}</span>

        <div className={styles.contentLayer}>
          {/* Top Bar */}
          <div className={styles.topRow}>
            <div className={styles.logoArea}>
              <svg
                className={styles.logoIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span className={styles.logoText}>
                <span className={styles.logoTextItalic}>Blood</span>Bridge
              </span>
            </div>
            <BloodTypeBadge type={bloodType} size="sm" />
          </div>

          {/* Middle Body */}
          <div className={styles.centerRow}>
            <div className={styles.leftDetails}>
              <span className={styles.name}>{name}</span>
              <span className={styles.verifiedLabel}>✓ Verified Donor</span>
              <span className={styles.statsLabel}>Donations: 7 • Lives: 21</span>
            </div>

            <div className={styles.rightDetails}>
              <div className={styles.qrWrapper}>
                <QRCodeSVG
                  value={`https://bloodbridge.net/verify/donor/${donorId}`}
                  size={72}
                  bgColor="transparent"
                  fgColor="#F4F0EC"
                  level="M"
                />
              </div>
              <span className={styles.serial}>BB-2024-{donorId.slice(-5)}</span>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className={styles.bottomRow}>
            <span className={styles.validThru}>VALID THRU {expiryDate}</span>
            <span className={styles.bloodTypeLabel}>Blood Type: {bloodType}</span>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        size="md"
        className={styles.downloadBtn}
        onClick={handlePrint}
        data-html2canvas-ignore="true"
      >
        Download Card
      </Button>
    </div>
  );
}
