'use client';

import React, { useState, useMemo } from 'react';
import InventoryBar from '../InventoryBar/InventoryBar';
import { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import styles from './BloodInventoryGrid.module.css';

interface InventoryItem {
  bloodType: BloodType;
  units: number;
  maxCapacity: number;
  lastUpdated: string;
}

interface BloodInventoryGridProps {
  inventory: InventoryItem[] | readonly InventoryItem[];
  className?: string;
}

type SortOption = 'urgency' | 'alphabetical' | 'volume';

export default function BloodInventoryGrid({
  inventory,
  className = '',
}: BloodInventoryGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('urgency');

  const sortedInventory = useMemo(() => {
    const list = [...inventory];
    return list.sort((a, b) => {
      if (sortBy === 'urgency') {
        const percentA = a.units / a.maxCapacity;
        const percentB = b.units / b.maxCapacity;
        return percentA - percentB; // Lower percent (more critical) first
      }
      if (sortBy === 'volume') {
        return b.units - a.units; // Higher volume first
      }
      // alphabetical
      return a.bloodType.localeCompare(b.bloodType);
    });
  }, [inventory, sortBy]);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Filter Chips */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Sort By</span>
        <div className={styles.chips}>
          <button
            onClick={() => setSortBy('urgency')}
            className={`${styles.chip} ${
              sortBy === 'urgency' ? styles.activeChip : ''
            }`}
          >
            Urgency
          </button>
          <button
            onClick={() => setSortBy('alphabetical')}
            className={`${styles.chip} ${
              sortBy === 'alphabetical' ? styles.activeChip : ''
            }`}
          >
            Alphabetical
          </button>
          <button
            onClick={() => setSortBy('volume')}
            className={`${styles.chip} ${
              sortBy === 'volume' ? styles.activeChip : ''
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {sortedInventory.map((item) => (
          <InventoryBar
            key={item.bloodType}
            bloodType={item.bloodType}
            units={item.units}
            maxCapacity={item.maxCapacity}
            lastUpdated={item.lastUpdated}
          />
        ))}
      </div>
    </div>
  );
}
