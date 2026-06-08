'use client';

import React, { useState, useMemo } from 'react';
import TopNav from '@/components/TopNav/TopNav';
import RequestCard from '@/components/RequestCard/RequestCard';
import LiveBadge from '@/components/LiveBadge/LiveBadge';
import { MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import styles from './emergency.module.css';

export default function EmergencyPage() {
  const [selectedUrgency, setSelectedUrgency] = useState<'all' | 'critical' | 'urgent' | 'standard'>('all');
  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [maxDistance, setMaxDistance] = useState('all');

  const filteredRequests = useMemo(() => {
    return MOCK_EMERGENCY_REQUESTS.filter((req) => {
      const matchUrgency = selectedUrgency === 'all' || req.urgency === selectedUrgency;
      const matchBlood = selectedBloodType === 'all' || req.bloodType === selectedBloodType;
      const matchDistance =
        maxDistance === 'all' ||
        (maxDistance === '5' && req.distance <= 5) ||
        (maxDistance === '10' && req.distance <= 10);
      return matchUrgency && matchBlood && matchDistance;
    }).sort((a, b) => {
      // Urgent urgency ordering: critical, then urgent, then standard
      const score = { critical: 3, urgent: 2, standard: 1 };
      return score[b.urgency] - score[a.urgency];
    });
  }, [selectedUrgency, selectedBloodType, maxDistance]);

  const handleAcceptRequest = (id: string) => {
    const matched = MOCK_EMERGENCY_REQUESTS.find((r) => r.id === id);
    if (matched) {
      alert(`Thank you! Response submitted for ${matched.hospital}. Direct matching notifications dispatched.`);
    }
  };

  return (
    <div className={styles.container}>
      <TopNav />

      {/* Crimson Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTitleGroup}>
            <h1 className={styles.bannerTitle}>Emergency Blood Requests</h1>
            <span className={styles.countBadge}>{filteredRequests.length} active</span>
          </div>
          <LiveBadge connected={true} />
        </div>
      </div>

      <div className={styles.content}>
        {/* Filters */}
        <div className={styles.filterRow}>
          <div className={styles.chips}>
            <button
              onClick={() => setSelectedUrgency('all')}
              className={`${styles.chip} ${selectedUrgency === 'all' ? styles.chipActive : ''}`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setSelectedUrgency('critical')}
              className={`${styles.chip} ${selectedUrgency === 'critical' ? styles.chipActive : ''}`}
              style={{ borderColor: selectedUrgency === 'critical' ? 'var(--status-critical)' : '' }}
            >
              Critical
            </button>
            <button
              onClick={() => setSelectedUrgency('urgent')}
              className={`${styles.chip} ${selectedUrgency === 'urgent' ? styles.chipActive : ''}`}
              style={{ borderColor: selectedUrgency === 'urgent' ? 'var(--status-low)' : '' }}
            >
              Urgent
            </button>
            <button
              onClick={() => setSelectedUrgency('standard')}
              className={`${styles.chip} ${selectedUrgency === 'standard' ? styles.chipActive : ''}`}
              style={{ borderColor: selectedUrgency === 'standard' ? 'var(--status-adequate)' : '' }}
            >
              Standard
            </button>
          </div>

          <div className={styles.selectors}>
            <select
              className={styles.select}
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
            >
              <option value="all">All Blood Types</option>
              <option value="O-">O-</option>
              <option value="O+">O+</option>
              <option value="A-">A-</option>
              <option value="A+">A+</option>
              <option value="B-">B-</option>
              <option value="B+">B+</option>
              <option value="AB-">AB-</option>
              <option value="AB+">AB+</option>
            </select>

            <select
              className={styles.select}
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
            >
              <option value="all">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
            </select>
          </div>
        </div>

        {/* Masonry-like Feed */}
        <div className={styles.feed}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <div key={req.id} className={styles.feedCard}>
                <RequestCard
                  id={req.id}
                  bloodType={req.bloodType as any}
                  unitsNeeded={req.unitsNeeded}
                  urgency={req.urgency as any}
                  hospital={req.hospital}
                  location={req.location}
                  distance={req.distance}
                  postedAt={req.postedAt}
                  onAccept={handleAcceptRequest}
                />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--ink-muted)' }}>
              No active emergency broadcasts match the selected filter query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
