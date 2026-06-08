'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../Button/Button';
import styles from './DonorQRCard.module.css';

interface DonorQRCardProps {
  donorId: string;
  name: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  expiryDate?: string;
  className?: string;
}

export default function DonorQRCard({
  donorId,
  name,
  bloodType,
  expiryDate = '12/28',
  className = '',
}: DonorQRCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (typeof window === 'undefined') return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 2, // Retain high-res output
        });
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `bloodbridge-donor-card-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = url;
        link.click();
      }
    } catch (error) {
      console.error('Error exporting donor card image:', error);
    }
  };

  return (
    <div className={`${styles.cardContainer} ${className}`}>
      {/* Visual Identity Card */}
      <div ref={cardRef} className={styles.card}>
        {/* Background Drop Overlay */}
        <svg
          className={styles.bgDropPattern}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>

        {/* Top area */}
        <div className={styles.topRow}>
          <div className={styles.logoArea}>
            <svg
              className={styles.logoIcon}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span className={styles.logoText}>
              <span className={styles.logoTextItalic}>Blood</span>Bridge
            </span>
          </div>
          <span className={styles.bloodTypeDisplay}>{bloodType}</span>
        </div>

        {/* QR Code Center area */}
        <div className={styles.centerRow}>
          <div className={styles.qrWrapper}>
            <QRCodeSVG
              value={`https://bloodbridge.net/verify/donor/${donorId}`}
              size={70}
              bgColor="#FFFFFF"
              fgColor="#080808"
              level="M"
            />
          </div>
        </div>

        {/* Bottom details */}
        <div className={styles.bottomRow}>
          <div className={styles.donorInfo}>
            <span className={styles.name}>{name}</span>
            <span className={styles.badge}>Verified Donor</span>
          </div>
          <div className={styles.expiryInfo}>
            <span className={styles.expiryLabel}>Expires</span>
            <span className={styles.expiryDate}>{expiryDate}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <Button
        variant="secondary"
        size="md"
        className={styles.downloadBtn}
        onClick={handleDownload}
      >
        Download Card
      </Button>
    </div>
  );
}
