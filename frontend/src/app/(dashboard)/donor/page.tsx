'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard/StatsCard';
import DataTable from '@/components/DataTable/DataTable';
import DonorQRCard from '@/components/DonorQRCard/DonorQRCard';
import RequestCard from '@/components/RequestCard/RequestCard';
import LiveBadge from '@/components/LiveBadge/LiveBadge';
import Button from '@/components/Button/Button';
import { MOCK_DONOR_STATS, MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import styles from './donor.module.css';

interface DonationHistoryItem {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  units: string;
  status: string;
}

export default function DonorDashboard() {
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com', bloodType: 'O-' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'John Doe',
          email: parsed.email || 'john@example.com',
          bloodType: parsed.bloodType || 'O-',
        });
      } catch (e) {}
    }
  }, []);

  const stats = MOCK_DONOR_STATS;

  // Filter 3 closest requests for O-
  const nearRequests = MOCK_EMERGENCY_REQUESTS.filter(r => r.bloodType === user.bloodType).slice(0, 3);

  const donationHistoryData: DonationHistoryItem[] = [
    { id: '1', date: '2026-05-12', location: 'City Central Donor Hub', bloodType: user.bloodType, units: '450 ml', status: 'Completed' },
    { id: '2', date: '2026-02-18', location: 'Apollo General Hospital', bloodType: user.bloodType, units: '450 ml', status: 'Completed' },
    { id: '3', date: '2025-11-05', location: 'Bandra Blood Bank Center', bloodType: user.bloodType, units: '450 ml', status: 'Completed' },
  ];

  const columns = [
    { key: 'date' as keyof DonationHistoryItem, header: 'Date' },
    { key: 'location' as keyof DonationHistoryItem, header: 'Location' },
    { key: 'bloodType' as keyof DonationHistoryItem, header: 'Blood Type' },
    { key: 'units' as keyof DonationHistoryItem, header: 'Units' },
    {
      key: 'status' as keyof DonationHistoryItem,
      header: 'Status',
      render: (value: any) => (
        <span style={{ color: 'var(--status-adequate)', fontWeight: 'semibold' }}>{value}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back, {user.name}</h1>
        <p className={styles.subtitle}>Your blood donation profile contributes to saving lives directly.</p>
      </div>

      {/* Row 1 — Stats */}
      <div className={styles.statsGrid}>
        <StatsCard value={stats.totalDonations} label="Total Donations" status="adequate" />
        <StatsCard value={`${stats.lifetimeLiters}L`} label="Lifetime Donated" status="adequate" />
        <StatsCard
          value={stats.daysUntilEligible === 0 ? 'Eligible Now' : `${stats.daysUntilEligible} days`}
          label="Days Until Eligible"
          status={stats.daysUntilEligible === 0 ? 'adequate' : 'low'}
        />
        <StatsCard value={stats.livesSaved} label="Lives Saved (Est.)" status="critical" />
      </div>

      {/* Row 2 — Split Layout */}
      <div className={styles.rowSplit}>
        {/* Left: Donation History */}
        <div className={styles.historyContainer}>
          <h2 className={styles.sectionTitle}>Recent Donation History</h2>
          <DataTable data={donationHistoryData} columns={columns} />
        </div>

        {/* Right: Digital Donor Card */}
        <div className={styles.qrContainer}>
          <DonorQRCard name={user.name} bloodType={user.bloodType as any} donorId="DB-98402-OB" />
          <Link href="/donor-card">
            <Button variant="outline" size="sm">
              Expand Donor Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 3 — Emergency Requests Near You */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <h2 className={styles.sectionTitle}>Emergency Requests Matching {user.bloodType}</h2>
            <LiveBadge connected={true} />
          </div>
          <Link href="/emergency" style={{ color: 'var(--crimson)', fontSize: 'var(--text-small)' }}>
            View all active requests →
          </Link>
        </div>
        <div className={styles.requestsGrid}>
          {nearRequests.length > 0 ? (
            nearRequests.map((req) => (
              <RequestCard
                key={req.id}
                id={req.id}
                bloodType={req.bloodType as any}
                unitsNeeded={req.unitsNeeded}
                urgency={req.urgency as any}
                hospital={req.hospital}
                location={req.location}
                distance={req.distance}
                postedAt={req.postedAt}
                onAccept={() => alert(`Accepted emergency request for ${req.hospital}`)}
              />
            ))
          ) : (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: 'var(--space-6) 0', color: 'var(--ink-muted)' }}>
              No active emergency requests in your area match your blood type at this time.
            </div>
          )}
        </div>
      </div>

      {/* Row 4 — Health Reminders */}
      <div className={styles.remindersCard}>
        <div className={styles.remindersLeft}>
          <h2 className={styles.sectionTitle}>Your Donation Eligibility Timeline</h2>
          <ul className={styles.reminderList}>
            <li className={styles.reminderItem}>
              <span className={styles.checkIcon}>✓</span> Last donation: May 12, 2026
            </li>
            <li className={styles.reminderItem}>
              <span className={styles.checkIcon}>✓</span> Recovery period ends: July 12, 2026
            </li>
            <li className={styles.reminderItem}>
              <span className={styles.checkIcon} style={{ color: 'var(--crimson)' }}>➔</span> Next eligibility date: June 23, 2026
            </li>
          </ul>
        </div>
        <Button variant="primary">Schedule Appointment</Button>
      </div>
    </div>
  );
}
