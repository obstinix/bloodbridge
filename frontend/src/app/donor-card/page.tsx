'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import TopNav from '@/components/TopNav/TopNav';
import DonorQRCard from '@/components/DonorQRCard/DonorQRCard';
import Button from '@/components/Button/Button';
import styles from './donor-card.module.css';

export default function DonorCardPage() {
  const [user, setUser] = useState({ name: 'John Doe', bloodType: 'O-' });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'John Doe',
          bloodType: parsed.bloodType || 'O-',
        });
      } catch (e) {}
    }
  }, []);

  const handleDownload = async () => {
    const node = cardRef.current;
    if (!node) return;
    try {
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `bloodbridge-donor-card-${user.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BloodBridge Digital Donor Card',
        text: `My verified digital donor card on BloodBridge network.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Verification link copied to clipboard!');
    }
  };

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Your Digital Donor Card</h1>
          <p className={styles.subtitle}>Verified digital identity for emergency matches response.</p>
        </div>

        {/* QR Card */}
        <div ref={cardRef} className={styles.cardWrapper}>
          <DonorQRCard name={user.name} bloodType={user.bloodType as any} donorId="DB-98402-OB" />
        </div>

        {/* Action Buttons */}
        <div className={styles.btnRow}>
          <Button variant="primary" size="md" onClick={handleDownload}>
            Download PNG
          </Button>
          <Button variant="outline" size="md" onClick={handleShare}>
            Share Verification
          </Button>
        </div>

        {/* Metadata Summary */}
        <div className={styles.infoSummary}>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Donor Name</span>
            <span className={styles.infoVal}>{user.name}</span>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Registration Status</span>
            <span className={styles.infoVal} style={{ color: 'var(--status-adequate)' }}>Verified</span>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Card Expiry</span>
            <span className={styles.infoVal}>Dec 2028</span>
          </div>
        </div>

        {/* Guide */}
        <div className={styles.guideSection}>
          <h3 className={styles.guideTitle}>How to use your digital card</h3>
          <div className={styles.guideGrid}>
            <div className={styles.guideCard}>
              <span className={styles.guideNum}>01</span>
              <span className={styles.guideCardTitle}>Keep it saved</span>
              <p className={styles.guideCardDesc}>
                Download or add the card to your device wallet for quick retrieval during emergencies.
              </p>
            </div>
            <div className={styles.guideCard}>
              <span className={styles.guideNum}>02</span>
              <span className={styles.guideCardTitle}>Present at Hub</span>
              <p className={styles.guideCardDesc}>
                Show this digital card to coordinators when arriving at donation drives or partner hospitals.
              </p>
            </div>
            <div className={styles.guideCard}>
              <span className={styles.guideNum}>03</span>
              <span className={styles.guideCardTitle}>Scan to Log</span>
              <p className={styles.guideCardDesc}>
                Medical admins scan the QR code to instantly verify credentials and update donation history logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
