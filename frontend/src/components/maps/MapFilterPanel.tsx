'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import styles from './MapFilterPanel.module.css';

interface MapFilterPanelProps {
  onFilterChange?: (filters: {
    selectedTypes: BloodType[];
    radius: number;
    urgency: string;
  }) => void;
  className?: string;
}

export default function MapFilterPanel({
  onFilterChange,
  className = '',
}: MapFilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<BloodType[]>([]);
  const [radius, setRadius] = useState(10);
  const [urgency, setUrgency] = useState<string>('all');

  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const handleTypeClick = (type: BloodType) => {
    let updated = [...selectedTypes];
    if (updated.includes(type)) {
      updated = updated.filter((t) => t !== type);
    } else {
      updated.push(type);
    }
    setSelectedTypes(updated);
    triggerChange(updated, radius, urgency);
  };

  const handleRadiusChange = (val: number) => {
    setRadius(val);
    triggerChange(selectedTypes, val, urgency);
  };

  const handleUrgencyChange = (val: string) => {
    setUrgency(val);
    triggerChange(selectedTypes, radius, val);
  };

  const triggerChange = (types: BloodType[], rad: number, urg: string) => {
    if (onFilterChange) {
      onFilterChange({ selectedTypes: types, radius: rad, urgency: urg });
    }
  };

  return (
    <>
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className={styles.expandBtn}
          aria-label="Open filter panel"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}

      <div
        className={`${styles.panel} ${
          collapsed ? styles.collapsed : ''
        } ${className}`}
      >
        <div className={styles.header}>
          <span className={styles.title}>Filter Map</span>
          <button
            onClick={() => setCollapsed(true)}
            className={styles.closeBtn}
            aria-label="Collapse panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Blood types grid */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Blood Type</span>
          <div className={styles.typeGrid}>
            {bloodTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeClick(type)}
                className={`${styles.typeChip} ${
                  selectedTypes.includes(type) ? styles.activeType : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Proximity range slider */}
        <div className={styles.section}>
          <div className={styles.rangeMeta}>
            <span className={styles.sectionLabel}>Proximity Range</span>
            <span>{radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className={styles.rangeSlider}
          />
        </div>

        {/* Urgency selection */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Urgency</span>
          <div className={styles.typeGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {['all', 'critical', 'urgent', 'standard'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => handleUrgencyChange(u)}
                className={`${styles.typeChip} ${
                  urgency === u ? styles.activeType : ''
                }`}
                style={{ textTransform: 'capitalize' }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
