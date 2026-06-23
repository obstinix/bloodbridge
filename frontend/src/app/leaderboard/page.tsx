'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav/TopNav';
import DataTable from '@/components/DataTable/DataTable';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import Button from '@/components/Button/Button';
import styles from './leaderboard.module.css';

interface LeaderboardUser {
  rank: number;
  name: string;
  bloodType: BloodType;
  donations: number;
  livesSaved: number;
  badgesEarned: number;
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'all' | 'year' | 'month'>('all');

  const getLeaderboardData = (tf: 'all' | 'year' | 'month') => {
    const allTop3 = [
      { rank: 2, name: 'Donor A***1', bloodType: 'O-' as BloodType, donations: 18, livesSaved: 54, badgesEarned: 4, styleClass: styles.rank2 },
      { rank: 1, name: 'Donor O***9', bloodType: 'AB-' as BloodType, donations: 24, livesSaved: 72, badgesEarned: 5, styleClass: styles.rank1 },
      { rank: 3, name: 'Donor X***7', bloodType: 'B+' as BloodType, donations: 15, livesSaved: 45, badgesEarned: 4, styleClass: styles.rank3 },
    ];
    const yearTop3 = [
      { rank: 2, name: 'Donor M***2', bloodType: 'A+' as BloodType, donations: 8, livesSaved: 24, badgesEarned: 2, styleClass: styles.rank2 },
      { rank: 1, name: 'Donor A***1', bloodType: 'O-' as BloodType, donations: 11, livesSaved: 33, badgesEarned: 3, styleClass: styles.rank1 },
      { rank: 3, name: 'Donor K***5', bloodType: 'O+' as BloodType, donations: 7, livesSaved: 21, badgesEarned: 2, styleClass: styles.rank3 },
    ];
    const monthTop3 = [
      { rank: 2, name: 'Donor L***4', bloodType: 'O-' as BloodType, donations: 2, livesSaved: 6, badgesEarned: 1, styleClass: styles.rank2 },
      { rank: 1, name: 'Donor P***8', bloodType: 'A-' as BloodType, donations: 3, livesSaved: 9, badgesEarned: 1, styleClass: styles.rank1 },
      { rank: 3, name: 'Donor J***0', bloodType: 'AB+' as BloodType, donations: 1, livesSaved: 3, badgesEarned: 1, styleClass: styles.rank3 },
    ];

    const allRows: LeaderboardUser[] = [
      { rank: 4, name: 'Donor M***2', bloodType: 'A+' as BloodType, donations: 12, livesSaved: 36, badgesEarned: 3 },
      { rank: 5, name: 'Donor K***5', bloodType: 'O+' as BloodType, donations: 11, livesSaved: 33, badgesEarned: 3 },
      { rank: 6, name: 'Donor P***8', bloodType: 'A-' as BloodType, donations: 9, livesSaved: 27, badgesEarned: 2 },
      { rank: 7, name: 'Donor R***3', bloodType: 'B-' as BloodType, donations: 8, livesSaved: 24, badgesEarned: 2 },
      { rank: 8, name: 'Donor J***0', bloodType: 'AB+' as BloodType, donations: 7, livesSaved: 21, badgesEarned: 2 },
      { rank: 9, name: 'Donor L***4', bloodType: 'O-' as BloodType, donations: 6, livesSaved: 18, badgesEarned: 1 },
      { rank: 10, name: 'Donor H***6', bloodType: 'A+' as BloodType, donations: 5, livesSaved: 15, badgesEarned: 1 },
    ];
    const yearRows: LeaderboardUser[] = [
      { rank: 4, name: 'Donor X***7', bloodType: 'B+' as BloodType, donations: 6, livesSaved: 18, badgesEarned: 2 },
      { rank: 5, name: 'Donor R***3', bloodType: 'B-' as BloodType, donations: 5, livesSaved: 15, badgesEarned: 1 },
      { rank: 6, name: 'Donor H***6', bloodType: 'A+' as BloodType, donations: 4, livesSaved: 12, badgesEarned: 1 },
    ];
    const monthRows: LeaderboardUser[] = [
      { rank: 4, name: 'Donor R***3', bloodType: 'B-' as BloodType, donations: 1, livesSaved: 3, badgesEarned: 1 },
      { rank: 5, name: 'Donor H***6', bloodType: 'A+' as BloodType, donations: 1, livesSaved: 3, badgesEarned: 0 },
    ];

    if (tf === 'year') return { top3: yearTop3, rows: yearRows };
    if (tf === 'month') return { top3: monthTop3, rows: monthRows };
    return { top3: allTop3, rows: allRows };
  };

  const { top3, rows: leaderboardRows } = getLeaderboardData(timeframe);

  const columns = [
    {
      key: 'rank' as keyof LeaderboardUser,
      header: 'Rank',
      render: (val: any) => <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>#{val}</span>,
    },
    { key: 'name' as keyof LeaderboardUser, header: 'Anonymized Identity' },
    {
      key: 'bloodType' as keyof LeaderboardUser,
      header: 'Type',
      render: (val: any) => <BloodTypeBadge type={val} size="sm" />,
    },
    {
      key: 'donations' as keyof LeaderboardUser,
      header: 'Donations',
      render: (val: any) => <span style={{ fontFamily: 'var(--font-mono)' }}>{val}</span>,
    },
    {
      key: 'livesSaved' as keyof LeaderboardUser,
      header: 'Lives Saved',
      render: (val: any) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--crimson)', fontWeight: 'bold' }}>{val}</span>,
    },
    {
      key: 'badgesEarned' as keyof LeaderboardUser,
      header: 'Badges',
      render: (val: any) => <span style={{ fontFamily: 'var(--font-mono)' }}>{val} earned</span>,
    },
  ];

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Community Impact Leaderboard</h1>
          <p className={styles.subtitle}>Anonymised donor rankings — your privacy is protected.</p>
        </div>

        {/* Filters */}
        <div className={styles.filterRow}>
          <button
            onClick={() => setTimeframe('all')}
            className={`${styles.chip} ${timeframe === 'all' ? styles.chipActive : ''}`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`${styles.chip} ${timeframe === 'year' ? styles.chipActive : ''}`}
          >
            This Year
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`${styles.chip} ${timeframe === 'month' ? styles.chipActive : ''}`}
          >
            This Month
          </button>
        </div>

        {/* Podium */}
        <div className={styles.podium}>
          {top3.map((donor) => (
            <div key={donor.name} className={`${styles.podiumCard} ${donor.styleClass}`}>
              <span className={styles.podiumNumber}>#{donor.rank}</span>
              <div className={styles.avatar}>
                {donor.name.split(' ')[1]?.[0]}
              </div>
              <span className={styles.donorName}>{donor.name}</span>
              <BloodTypeBadge type={donor.bloodType} size="sm" />
              <div className={styles.donorMetric} style={{ marginTop: 'auto' }}>
                <span style={{ color: 'var(--ink)', fontWeight: 'bold' }}>{donor.donations}</span> Donations
              </div>
              <div className={styles.donorMetric} style={{ fontSize: '10px' }}>
                <span style={{ color: 'var(--crimson)', fontWeight: 'bold' }}>{donor.livesSaved}</span> Lives Saved
              </div>
            </div>
          ))}
        </div>

        {/* Rankings Table */}
        <div style={{ backgroundColor: 'var(--canvas-raised)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <DataTable data={leaderboardRows} columns={columns} />
        </div>

        {/* CTA */}
        <div className={styles.ctaBox}>
          <h3 style={{ fontFamily: 'var(--font-ui)', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
            Want to see where you rank?
          </h3>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)', marginBottom: 'var(--space-4)' }}>
            Register as a donor or sign in to track your lifetime impact achievements!
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Link href="/login">
              <Button variant="primary">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Register Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
