'use client';

import React, { useState, useMemo } from 'react';
import TopNav from '@/components/TopNav/TopNav';
import BloodInventoryGrid from '@/components/BloodInventoryGrid/BloodInventoryGrid';
import LiveBadge from '@/components/LiveBadge/LiveBadge';
import { MOCK_INVENTORY } from '@/lib/mockData';
import styles from './inventory.module.css';

export default function InventoryPage() {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'O' | 'A' | 'B' | 'AB'>('all');
  const [facility, setFacility] = useState('all');

  const filteredInventory = useMemo(() => {
    return MOCK_INVENTORY.filter((item) => {
      if (selectedGroup === 'all') return true;
      if (selectedGroup === 'O') return item.bloodType.startsWith('O');
      if (selectedGroup === 'A') return item.bloodType.startsWith('A') && !item.bloodType.startsWith('AB');
      if (selectedGroup === 'B') return item.bloodType.startsWith('B');
      // AB
      return item.bloodType.startsWith('AB');
    });
  }, [selectedGroup]);

  // Aggregate Units
  const totalUnits = MOCK_INVENTORY.reduce((sum, item) => sum + item.units, 0);
  const criticalShortagesCount = MOCK_INVENTORY.filter(
    (item) => item.units / item.maxCapacity <= 0.2
  ).length;

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Global Blood Inventory</h1>
            <LiveBadge connected={true} />
          </div>
          <span className={styles.timestamp}>Last synced: Just now</span>
        </div>

        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.chips}>
            <button
              onClick={() => setSelectedGroup('all')}
              className={`${styles.chip} ${selectedGroup === 'all' ? styles.chipActive : ''}`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedGroup('O')}
              className={`${styles.chip} ${selectedGroup === 'O' ? styles.chipActive : ''}`}
            >
              Type O
            </button>
            <button
              onClick={() => setSelectedGroup('A')}
              className={`${styles.chip} ${selectedGroup === 'A' ? styles.chipActive : ''}`}
            >
              Type A
            </button>
            <button
              onClick={() => setSelectedGroup('B')}
              className={`${styles.chip} ${selectedGroup === 'B' ? styles.chipActive : ''}`}
            >
              Type B
            </button>
            <button
              onClick={() => setSelectedGroup('AB')}
              className={`${styles.chip} ${selectedGroup === 'AB' ? styles.chipActive : ''}`}
            >
              Type AB
            </button>
          </div>

          <div className={styles.selectors}>
            <select
              className={styles.select}
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="mumbai">Mumbai Central</option>
              <option value="bandra">Bandra West</option>
              <option value="andheri">Andheri East</option>
            </select>
          </div>
        </div>

        {/* Layout */}
        <div className={styles.layout}>
          {/* Main Grid */}
          <div className={styles.mainGrid}>
            <BloodInventoryGrid inventory={filteredInventory} />
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Summary */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Network Summary</h3>
              <ul className={styles.summaryList}>
                <li className={styles.summaryItem}>
                  <span>Total Available Reserves</span>
                  <span style={{ color: 'var(--ink)' }}>{totalUnits} units</span>
                </li>
                <li className={styles.summaryItem}>
                  <span>Active Alerts Count</span>
                  <span style={{ color: 'var(--crimson)' }}>{criticalShortagesCount} alerts</span>
                </li>
                <li className={styles.summaryItem}>
                  <span>Average Facility Capacity</span>
                  <span style={{ color: 'var(--ink)' }}>64.8%</span>
                </li>
              </ul>
            </div>

            {/* Critical Alerts panel */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Critical Shortages</h3>
              {criticalShortagesCount > 0 ? (
                MOCK_INVENTORY.filter((item) => item.units / item.maxCapacity <= 0.2).map((item) => (
                  <div key={item.bloodType} className={styles.alertCard}>
                    <div className={styles.alertTitle}>Type {item.bloodType} Warning</div>
                    <p className={styles.alertDesc}>
                      Supply reserve is at {item.units} units (Threshold: {Math.floor(item.maxCapacity * 0.2)} units).
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)' }}>
                  No critical shortages warning flags.
                </div>
              )}
            </div>

            {/* Collection drives */}
            <div className={styles.panel}>
              <h3 className={styles.panelTitle}>Upcoming Donation Drives</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ fontSize: 'var(--text-small)' }}>
                  <div style={{ fontWeight: 'semibold', color: 'var(--ink)' }}>Bandra Community Hub</div>
                  <div style={{ fontSize: 'var(--text-caption)', color: 'var(--ink-muted)' }}>June 12, 09:00 - 15:00</div>
                </div>
                <div style={{ fontSize: 'var(--text-small)' }}>
                  <div style={{ fontWeight: 'semibold', color: 'var(--ink)' }}>City Corporate Plaza</div>
                  <div style={{ fontSize: 'var(--text-caption)', color: 'var(--ink-muted)' }}>June 15, 10:00 - 17:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
