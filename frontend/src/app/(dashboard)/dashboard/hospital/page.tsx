'use client';

import React, { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard/StatsCard';
import BloodInventoryGrid from '@/components/BloodInventoryGrid/BloodInventoryGrid';
import DataTable from '@/components/DataTable/DataTable';
import Button from '@/components/Button/Button';
import { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './hospital.module.css';

interface RequestItem {
  id: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: 'critical' | 'urgent' | 'standard';
  postedAt: string;
  status: string;
  matchedDonors: number;
}

export default function HospitalDashboard() {
  const inventory = useRealTimeInventory();
  const [user, setUser] = useState({ name: 'City General Hospital', email: 'hospital@example.com' });
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [units, setUnits] = useState(4);
  const [urgency, setUrgency] = useState<'critical' | 'urgent' | 'standard'>('critical');
  const [notes, setNotes] = useState('');
  const [requestsList, setRequestsList] = useState<RequestItem[]>([
    { id: '1', bloodType: 'O-', unitsNeeded: 4, urgency: 'critical', postedAt: '5 min ago', status: 'Pending Matches', matchedDonors: 14 },
    { id: '2', bloodType: 'A+', unitsNeeded: 12, urgency: 'urgent', postedAt: '2 hours ago', status: 'In Transit', matchedDonors: 8 },
    { id: '3', bloodType: 'B-', unitsNeeded: 3, urgency: 'standard', postedAt: '1 day ago', status: 'Completed', matchedDonors: 4 },
  ]);

  const inventoryRef = useScrollReveal();
  const tableRef = useScrollReveal();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'City General Hospital',
          email: parsed.email || 'hospital@example.com',
        });
      } catch (e) {}
    }
  }, []);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: RequestItem = {
      id: String(requestsList.length + 1),
      bloodType,
      unitsNeeded: units,
      urgency,
      postedAt: 'Just now',
      status: 'Dispatching Alerts',
      matchedDonors: Math.floor(Math.random() * 25) + 3,
    };

    setRequestsList([newRequest, ...requestsList]);
    setNotes('');
    setUnits(4);
    alert(`Emergency alert dispatched for ${units} units of ${bloodType}!`);
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to cancel this emergency request?')) {
      setRequestsList(requestsList.filter(r => r.id !== id));
    }
  };

  const getMatchedCount = () => {
    switch (bloodType) {
      case 'O-': return 14;
      case 'O+': return 42;
      case 'A-': return 12;
      case 'A+': return 38;
      case 'B-': return 8;
      case 'B+': return 28;
      case 'AB-': return 4;
      case 'AB+': return 22;
      default: return 0;
    }
  };

  const activeRequestsCount = requestsList.filter(r => r.status !== 'Completed').length;

  const columns = [
    { key: 'bloodType' as keyof RequestItem, header: 'Blood Type' },
    { key: 'unitsNeeded' as keyof RequestItem, header: 'Units' },
    {
      key: 'urgency' as keyof RequestItem,
      header: 'Urgency',
      render: (val: any) => (
        <span
          style={{
            color:
              val === 'critical'
                ? 'var(--status-critical)'
                : val === 'urgent'
                ? 'var(--status-low)'
                : 'var(--status-adequate)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: 'var(--text-caption)',
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'postedAt' as keyof RequestItem, header: 'Posted' },
    {
      key: 'status' as keyof RequestItem,
      header: 'Status',
      render: (val: any) => (
        <span
          style={{
            color: val === 'Completed' ? 'var(--ink-muted)' : 'var(--ink)',
            fontStyle: val === 'Completed' ? 'italic' : 'normal',
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'matchedDonors' as keyof RequestItem, header: 'Matches' },
    {
      key: 'id' as keyof RequestItem,
      header: 'Actions',
      render: (val: any, row: any) => (
        row.status !== 'Completed' ? (
          <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(val)}>
            Cancel
          </Button>
        ) : (
          <span style={{ color: 'var(--ink-subtle)', fontStyle: 'italic', fontSize: 'var(--text-caption)' }}>Archived</span>
        )
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{user.name} Portal</h1>
        <p className={styles.subtitle}>Coordinate and monitor emergency blood reserve requirements.</p>
      </div>

      {/* Row 1 — Stats */}
      <div className={styles.statsGrid}>
        <StatsCard value={activeRequestsCount} label="Active Requests" status={activeRequestsCount > 0 ? 'critical' : 'adequate'} />
        <StatsCard value="27" label="Fulfilled Requests (30d)" />
        <StatsCard value="2.4h" label="Avg. Fulfillment Time" />
        <StatsCard value="12" label="Matched Donors (Live)" status="adequate" />
      </div>

      {/* Row 2 — Current Inventory */}
      <div ref={inventoryRef as any} className={`${styles.inventorySection} reveal`}>
        <h2 className={styles.sectionTitle}>Hospital Blood Supply Reserve</h2>
        <BloodInventoryGrid inventory={inventory} />
      </div>

      {/* Row 3 — Split Section */}
      <div className={styles.rowSplit}>
        {/* Left: Dispatch Emergency Request */}
        <div className={styles.formContainer}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Dispatch Emergency Request</h2>
          <p className={styles.subtitle} style={{ marginBottom: '10px' }}>Instantly broadcast emergency blood requests to local donors.</p>

          <form className={styles.form} onSubmit={handleCreateRequest}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Required Blood Type</label>
              <select
                className={styles.select}
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as BloodType)}
              >
                <option value="O-">O- (Universal)</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="A+">A+</option>
                <option value="B-">B-</option>
                <option value="B+">B+</option>
                <option value="AB-">AB-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Units Required</label>
              <input
                type="number"
                min="1"
                max="50"
                className={styles.input}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Urgency Level</label>
              <div className={styles.radioGrid}>
                <button
                  type="button"
                  onClick={() => setUrgency('critical')}
                  className={`${styles.radioCard} ${
                    urgency === 'critical' ? styles.radioCardCritical : ''
                  }`}
                >
                  Critical
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  className={`${styles.radioCard} ${
                    urgency === 'urgent' ? styles.radioCardUrgent : ''
                  }`}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`${styles.radioCard} ${
                    urgency === 'standard' ? styles.radioCardStandard : ''
                  }`}
                >
                  Standard
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Special Delivery Instructions / Notes</label>
              <textarea
                className={styles.textarea}
                placeholder="Include medical facility gate entrance, contact info, or emergency case reference..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className={styles.previewBox}>
              Broadcasting alerts to <span className={styles.previewHighlight}>{getMatchedCount()} compatible donors</span> within a 10km radius.
            </div>

            <Button variant="danger" size="md" type="submit">
              Broadcast Request
            </Button>
          </form>
        </div>

        {/* Right: Active Requests Table */}
        <div ref={tableRef as any} className={`${styles.tableContainer} reveal`}>
          <h2 className={styles.sectionTitle}>Active Emergency Broadcasts</h2>
          <DataTable data={requestsList} columns={columns} />
        </div>
      </div>
    </div>
  );
}
