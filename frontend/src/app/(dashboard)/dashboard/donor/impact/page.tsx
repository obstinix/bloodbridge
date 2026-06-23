'use client';

import React, { useState, useEffect, useRef } from 'react';
import StatsCard from '@/components/StatsCard/StatsCard';
import DonationHeatmap from '@/components/profile/DonationHeatmap';
import BadgeGrid from '@/components/profile/BadgeGrid';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './impact.module.css';



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
  const animatedUnits = useCountUp(donationsCount * 450, 1400, triggerCount);
  const animatedStreak = useCountUp(14, 1000, triggerCount);

  // SVG progress ring
  const RING_RADIUS = 90;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const LIVES_TARGET = 75;
  const livesTotal = donationsCount * 3;
  const ringPercent = Math.min(livesTotal / LIVES_TARGET, 1);
  const targetOffset = RING_CIRCUMFERENCE * (1 - ringPercent);
  const [dashOffset, setDashOffset] = useState(RING_CIRCUMFERENCE);

  useEffect(() => {
    if (!triggerCount) return;
    // Delay slightly so the initial full-offset renders first
    const raf = requestAnimationFrame(() => {
      setDashOffset(targetOffset);
    });
    return () => cancelAnimationFrame(raf);
  }, [triggerCount, targetOffset]);

  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();



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

      {/* Progress Ring */}
      <div className={styles.ringSection}>
        <div className={styles.ringWrapper}>
          <svg
            className={styles.ringSvg}
            width="220"
            height="220"
            viewBox="0 0 220 220"
            aria-label={`Impact score: ${livesTotal} lives contributed out of ${LIVES_TARGET} target`}
          >
            {/* Track */}
            <circle
              className={styles.ringTrack}
              cx="110"
              cy="110"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="12"
            />
            {/* Progress */}
            <circle
              className={styles.ringProgress}
              cx="110"
              cy="110"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 110 110)"
            />
          </svg>
          <div className={styles.ringCenter}>
            <span className={styles.ringValue}>{animatedLives}</span>
            <span className={styles.ringLabel}>lives impacted</span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className={styles.breakdownRow}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownValue}>{animatedDonations}</span>
            <span className={styles.breakdownLabel}>Total Donations</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownValue}>{animatedUnits}<small className={styles.breakdownUnit}>ml</small></span>
            <span className={styles.breakdownLabel}>Total Units</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownValue}>{animatedLives}</span>
            <span className={styles.breakdownLabel}>Lives Impacted</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownValue}>{animatedStreak}<small className={styles.breakdownUnit}>d</small></span>
            <span className={styles.breakdownLabel}>Streak</span>
          </div>
        </div>
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
          <BadgeGrid />
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

      {/* Donation Activity Calendar */}
      <DonationHeatmap />
    </div>
  );
}
