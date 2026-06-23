'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import TopNav from '@/components/TopNav/TopNav';
import LiveBadge from '@/components/LiveBadge/LiveBadge';
import MapFilterPanel from '@/components/maps/MapFilterPanel';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import styles from './map.module.css';

const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>,
});

const HOSPITAL_PINS = [
  { id: 'h1', name: 'Lilavati Hospital', lat: 19.0509, lng: 72.8294, type: 'hospital', bloodTypes: ['O-', 'O+', 'A-'], urgency: 'critical' as const },
  { id: 'h2', name: 'Kokilaben Dhirubhai', lat: 19.1310, lng: 72.8265, type: 'hospital', bloodTypes: ['AB-', 'B-'], urgency: 'critical' as const },
  { id: 'h3', name: 'Tata Memorial Centre', lat: 19.0048, lng: 72.8434, type: 'hospital', bloodTypes: ['O-', 'A+'], urgency: 'urgent' as const },
  { id: 'h4', name: 'Hinduja Hospital', lat: 19.0383, lng: 72.8419, type: 'hospital', bloodTypes: ['B+', 'O+'], urgency: 'urgent' as const },
  { id: 'b1', name: 'City Central Donor Hub', lat: 18.9750, lng: 72.8258, type: 'bank', bloodTypes: ['O-', 'O+', 'A+', 'B+'], urgency: 'standard' as const },
  { id: 'b2', name: 'Bandra Blood Center', lat: 19.0543, lng: 72.8403, type: 'bank', bloodTypes: ['AB+', 'AB-'], urgency: 'standard' as const },
  { id: 'b3', name: 'Andheri Blood Bank', lat: 19.1197, lng: 72.8464, type: 'bank', bloodTypes: ['A-', 'B-', 'O+'], urgency: 'standard' as const },
];

export default function MapPage() {
  const [filters, setFilters] = useState<{ selectedTypes: BloodType[]; radius: number; urgency: string }>({
    selectedTypes: [],
    radius: 10,
    urgency: 'all',
  });
  const [selectedPin, setSelectedPin] = useState<typeof HOSPITAL_PINS[0] | null>(null);

  const filteredPins = useMemo(() => {
    return HOSPITAL_PINS.filter(pin => {
      const matchUrgency = filters.urgency === 'all' || pin.urgency === filters.urgency;
      const matchType = filters.selectedTypes.length === 0 ||
        pin.bloodTypes.some(bt => filters.selectedTypes.includes(bt as BloodType));
      return matchUrgency && matchType;
    });
  }, [filters]);

  const criticalCount = HOSPITAL_PINS.filter(p => p.urgency === 'critical').length;

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.layout}>
        {/* Left sidebar: filters + pin list */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Live Network Map</h2>
            <LiveBadge connected={true} />
          </div>
          <div className={styles.sidebarStats}>
            <span className={styles.statPill} style={{ color: 'var(--status-critical)', borderColor: 'var(--status-critical)' }}>
              {criticalCount} Critical
            </span>
            <span className={styles.statPill}>
              {HOSPITAL_PINS.length} Facilities
            </span>
          </div>

          <MapFilterPanel onFilterChange={setFilters} />

          <div className={styles.pinList}>
            {filteredPins.map(pin => (
              <div
                key={pin.id}
                className={`${styles.pinListItem} ${selectedPin?.id === pin.id ? styles.pinListItemActive : ''}`}
                onClick={() => setSelectedPin(pin)}
              >
                <div className={styles.pinListLeft}>
                  <span className={`${styles.pinUrgencyDot}
                    ${pin.urgency === 'critical' ? styles.dotCritical :
                      pin.urgency === 'urgent' ? styles.dotUrgent : styles.dotStandard}`} />
                  <div>
                    <span className={styles.pinListName}>{pin.name}</span>
                    <div className={styles.pinListTypes}>
                      {pin.bloodTypes.map(bt => (
                        <BloodTypeBadge key={bt} type={bt as BloodType} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map canvas */}
        <div className={styles.mapWrapper}>
          <MapCanvas pins={filteredPins} selectedPin={selectedPin} onPinSelect={setSelectedPin} />
        </div>
      </div>
    </div>
  );
}
