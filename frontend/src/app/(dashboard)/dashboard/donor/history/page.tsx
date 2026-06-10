'use client';

import React, { useState, useEffect } from 'react';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import DataTable from '@/components/DataTable/DataTable';
import Button from '@/components/Button/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './history.module.css';

interface DonationHistoryItem {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  units: string;
  status: string;
}

export default function HistoryPage() {
  const [user, setUser] = useState({ name: 'John Doe', bloodType: 'O-' as BloodType });
  const [historyList, setHistoryList] = useState<DonationHistoryItem[]>([]);

  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    let bType: BloodType = 'O-';
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        bType = parsed.bloodType || 'O-';
        setUser({
          name: parsed.name || 'John Doe',
          bloodType: bType,
        });
      } catch (e) {}
    }

    // Load from schedule/commitments to append any new completed ones
    const savedSchedule = localStorage.getItem('bb_schedule');
    let scheduled: any[] = [];
    if (savedSchedule) {
      try {
        scheduled = JSON.parse(savedSchedule);
      } catch (e) {}
    }

    const defaultHistory: DonationHistoryItem[] = [
      { id: 'h-1', date: '2026-05-12', location: 'City Central Donor Hub', bloodType: bType, units: '450 ml', status: 'Completed' },
      { id: 'h-2', date: '2026-02-18', location: 'Apollo General Hospital', bloodType: bType, units: '450 ml', status: 'Completed' },
      { id: 'h-3', date: '2025-11-05', location: 'Bandra Blood Bank Center', bloodType: bType, units: '450 ml', status: 'Completed' },
    ];

    // Merge any scheduled that are completed or in the past (mocking it)
    const combined = [...defaultHistory];
    scheduled.forEach((app, idx) => {
      // Mocking completed for scheduled appointments older than or equal to today
      const appDate = new Date(app.date);
      const today = new Date(2026, 5, 9); // June 9, 2026
      if (appDate <= today) {
        combined.unshift({
          id: `h-sched-${idx}`,
          date: app.date,
          location: app.center || app.hospital,
          bloodType: bType,
          units: '450 ml',
          status: 'Completed',
        });
      }
    });

    setHistoryList(combined);
  }, []);

  const handleDownloadCertificate = (item: DonationHistoryItem) => {
    alert(`Generating official donor certificate for donation on ${item.date} at ${item.location}.\nSecurity Signature: BB-${item.id.toUpperCase()}-VERIFIED.`);
  };

  const columns = [
    { key: 'date' as keyof DonationHistoryItem, header: 'Date' },
    { key: 'location' as keyof DonationHistoryItem, header: 'Facility Location' },
    {
      key: 'bloodType' as keyof DonationHistoryItem,
      header: 'Blood Type',
      render: (val: any) => <BloodTypeBadge type={val} size="sm" />,
    },
    { key: 'units' as keyof DonationHistoryItem, header: 'Volume' },
    {
      key: 'status' as keyof DonationHistoryItem,
      header: 'Verification Status',
      render: (val: any) => (
        <span style={{ color: 'var(--status-adequate)', fontWeight: 'semibold' }}>{val}</span>
      ),
    },
    {
      key: 'id' as keyof DonationHistoryItem,
      header: 'Document',
      render: (val: any, row: DonationHistoryItem) => (
        <button className={styles.downloadBtn} onClick={() => handleDownloadCertificate(row)}>
          Certificate
        </button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Your Donation Logs</h1>
        <p className={styles.subtitle}>
          Access verified donation dates, locations, volumes, and download official medical certificates.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Left Column: History Logs table */}
        <div ref={revealRef1 as any} className={`${styles.historySection} reveal`}>
          <h2 className={styles.sectionTitle}>Verification Logs ({historyList.length})</h2>
          <DataTable data={historyList} columns={columns} />
        </div>

        {/* Right Column: Statistics overview */}
        <div ref={revealRef2 as any} className={`${styles.statsSection} reveal`}>
          <h2 className={styles.sectionTitle}>Lifetime Analytics</h2>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Lifetime Donated Volume</span>
                <span className={styles.statValue}>{(historyList.length * 0.45).toFixed(2)} Liters</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Total Saved Lives (Est.)</span>
                <span className={styles.statValue} style={{ color: 'var(--crimson)' }}>
                  {historyList.length * 3} lives
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Average Interval Rate</span>
                <span className={styles.statValue}>89 days</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statMeta}>
                <span className={styles.statLabel}>Deferral Clearance</span>
                <span className={styles.statValue} style={{ color: 'var(--status-adequate)' }}>
                  Cleared
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
