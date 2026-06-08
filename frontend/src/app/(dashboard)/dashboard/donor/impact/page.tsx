'use client';

import React, { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard/StatsCard';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './impact.module.css';

interface Badge {
  id: string;
  name: string;
  desc: string;
  threshold: number;
  icon: React.ReactNode;
}

export default function DonorImpactPage() {
  const [donationsCount, setDonationsCount] = useState(7);
  const [triggerCount, setTriggerCount] = useState(false);

  useEffect(() => {
    // Read from localStorage
    const savedSettings = localStorage.getItem('bb_settings');
    const userStr = localStorage.getItem('user');
    let donations = 7;
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser.role === 'donor') {
          // Keep default mock stats
        }
      } catch (e) {}
    }
    setDonationsCount(donations);
    setTriggerCount(true);

    // Save impact metadata
    localStorage.setItem(
      'bb_impact',
      JSON.stringify({
        totalDonations: donations,
        livesSaved: donations * 3,
        lifetimeVolume: (donations * 0.45).toFixed(1) + 'L',
      })
    );
  }, []);

  // Animate counters
  const animatedLives = useCountUp(donationsCount * 3, 1500, triggerCount);
  const animatedDonations = useCountUp(donationsCount, 1200, triggerCount);

  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();

  const badges: Badge[] = [
    {
      id: 'first-drop',
      name: 'First Drop',
      desc: 'Completed your first verified blood donation.',
      threshold: 1,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: 'consistent-giver',
      name: 'Consistent Giver',
      desc: 'Completed 3 donations in a 12-month period.',
      threshold: 3,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </svg>
      ),
    },
    {
      id: 'life-saver',
      name: 'Life Saver',
      desc: 'Completed 5 verified blood donations.',
      threshold: 5,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M14.5 9.5L9.5 14.5M9.5 9.5l5 5" />
        </svg>
      ),
    },
    {
      id: 'emergency-hero',
      name: 'Emergency Hero',
      desc: 'Responded directly to an active critical SOS broadcast.',
      threshold: 1, // Custom criteria met
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      id: 'marathon-donor',
      name: 'Marathon Giver',
      desc: 'Complete 10 verified blood donations.',
      threshold: 10,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a4 4 0 0 1 4 4v3H8V6a4 4 0 0 1 4-4z" />
        </svg>
      ),
    },
    {
      id: 'elite-donor',
      name: 'Elite Star',
      desc: 'Complete 25 verified blood donations.',
      threshold: 25,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const journeyTimeline = [
    {
      id: 'j1',
      date: '2026-05-12',
      facility: 'City Central Donor Hub',
      context: 'Emergency surgery response (O- critical)',
      type: 'emergency',
    },
    {
      id: 'j2',
      date: '2026-02-18',
      facility: 'Apollo General Hospital',
      context: 'Scheduled procedure reservation',
      type: 'scheduled',
    },
    {
      id: 'j3',
      date: '2025-11-05',
      facility: 'Bandra Blood Bank Center',
      context: 'Routine blood bank storage supply',
      type: 'stored',
    },
  ];

  // Milestone check: Marathon donor (10)
  const milestoneTarget = 10;
  const milestonePercent = Math.min((donationsCount / milestoneTarget) * 100, 100);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Your Impact Journey</h1>
        <p className={styles.subtitle}>Supervise your active achievements and logged donations history.</p>
      </div>

      {/* Row 1: Hero Stats */}
      <div className={`${styles.statsGrid} stagger`}>
        <StatsCard value={animatedLives} label="Lives Saved (Est.)" status="critical" />
        <StatsCard value={animatedDonations} label="Total Donations" status="adequate" />
        <StatsCard value={`${(donationsCount * 0.45).toFixed(1)}L`} label="Lifetime Volume" status="adequate" />
      </div>

      {/* Row 2: Split Layout */}
      <div className={styles.layout}>
        {/* Left: Donation Journey */}
        <div ref={revealRef1 as any} className={`${styles.panel} reveal`}>
          <h2 className={styles.panelTitle}>Donation Journey Timeline</h2>
          <div className={`${styles.timeline} stagger`}>
            {journeyTimeline.map((item) => (
              <div key={item.id} className={`${styles.timelineItem} reveal`}>
                <div
                  className={`${styles.timelineDot} ${
                    item.type === 'emergency'
                      ? styles.dotEmergency
                      : item.type === 'scheduled'
                      ? styles.dotScheduled
                      : styles.dotStored
                  }`}
                />
                <div className={styles.timelineMeta}>
                  <span>{item.date}</span>
                  <span style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>{item.type}</span>
                </div>
                <span className={styles.facility}>{item.facility}</span>
                <span className={styles.context}>{item.context}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Achievements Grid */}
        <div ref={revealRef2 as any} className={`${styles.panel} reveal`}>
          <h2 className={styles.panelTitle}>Achievement Badges Tiers</h2>
          <div className={styles.badgesGrid}>
            {badges.map((badge) => {
              const isUnlocked = donationsCount >= badge.threshold;
              return (
                <div
                  key={badge.id}
                  className={`${styles.badgeCard} ${!isUnlocked ? styles.badgeLocked : ''}`}
                >
                  <div className={styles.badgeIcon}>{badge.icon}</div>
                  <span className={styles.badgeName}>{badge.name}</span>
                  <p className={styles.badgeDesc}>{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Next Milestone */}
      <div className={styles.milestoneBox}>
        <div className={styles.milestoneHeader}>
          <span>Next Milestone: Marathon Giver Badge</span>
          <span>{donationsCount} / {milestoneTarget} Donations</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${milestonePercent}%` }} />
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-small)', color: 'var(--ink-muted)' }}>
          You are <span style={{ color: 'var(--status-adequate)', fontWeight: 'bold' }}>{milestoneTarget - donationsCount} donations away</span> from achieving your Marathon Giver tier!
        </p>
      </div>
    </div>
  );
}
