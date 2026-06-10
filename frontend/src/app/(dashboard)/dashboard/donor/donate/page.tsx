'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import { useRealTimeRequests } from '@/lib/useRealTimeSimulation';
import { COMPATIBILITY_MATRIX } from '@/app/compatibility/page';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './donate.module.css';

interface Commitment {
  id: string;
  hospital: string;
  bloodType: BloodType;
  units: number;
  date: string;
  timeSlot: string;
  urgency: string;
}

export default function DonatePage() {
  const [user, setUser] = useState({ name: 'John Doe', bloodType: 'O-' as BloodType });
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [successCommitment, setSuccessCommitment] = useState<Commitment | null>(null);

  // Form states for general donation
  const [generalCenter, setGeneralCenter] = useState('City Central Donor Hub');
  const [generalDate, setGeneralDate] = useState('');
  const [generalTime, setGeneralTime] = useState('09:00 AM - 10:00 AM');

  const requests = useRealTimeRequests();
  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          name: parsed.name || 'John Doe',
          bloodType: parsed.bloodType || 'O-',
        });
      } catch (e) {}
    }

    // Load existing commitments from localStorage
    const saved = localStorage.getItem('bb_schedule');
    if (saved) {
      try {
        setCommitments(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Filter emergency requests compatible with donor's blood type
  const compatibleRequests = requests.filter(
    (req) => COMPATIBILITY_MATRIX[user.bloodType] && COMPATIBILITY_MATRIX[user.bloodType][req.bloodType as BloodType]
  );

  const handleCommitToRequest = (req: any) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = 'Immediate (Emergency SOS Response)';

    const newCommitment: Commitment = {
      id: `commit-${Date.now()}`,
      hospital: req.hospital,
      bloodType: req.bloodType as BloodType,
      units: req.unitsNeeded,
      date: dateStr,
      timeSlot: timeStr,
      urgency: req.urgency,
    };

    const updated = [newCommitment, ...commitments];
    setCommitments(updated);
    localStorage.setItem('bb_schedule', JSON.stringify(updated));
    setSuccessCommitment(newCommitment);

    // Increment donor total donations mock counter in bb_impact
    const savedImpact = localStorage.getItem('bb_impact');
    if (savedImpact) {
      try {
        const parsed = JSON.parse(savedImpact);
        parsed.totalDonations = (parsed.totalDonations || 0) + 1;
        parsed.livesSaved = parsed.totalDonations * 3;
        parsed.lifetimeVolume = (parsed.totalDonations * 0.45).toFixed(1) + 'L';
        localStorage.setItem('bb_impact', JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalDate) return;

    const newCommitment: Commitment = {
      id: `commit-${Date.now()}`,
      hospital: generalCenter,
      bloodType: user.bloodType,
      units: 1,
      date: generalDate,
      timeSlot: generalTime,
      urgency: 'standard',
    };

    const updated = [newCommitment, ...commitments];
    setCommitments(updated);
    localStorage.setItem('bb_schedule', JSON.stringify(updated));
    setSuccessCommitment(newCommitment);
    setGeneralDate('');

    // Increment donor total donations mock counter
    const savedImpact = localStorage.getItem('bb_impact');
    if (savedImpact) {
      try {
        const parsed = JSON.parse(savedImpact);
        parsed.totalDonations = (parsed.totalDonations || 0) + 1;
        parsed.livesSaved = parsed.totalDonations * 3;
        parsed.lifetimeVolume = (parsed.totalDonations * 0.45).toFixed(1) + 'L';
        localStorage.setItem('bb_impact', JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Emergency Donation Commitments</h1>
        <p className={styles.subtitle}>
          Choose to respond directly to a matching emergency SOS broadcast or register a general donation commitment.
        </p>
      </div>

      {successCommitment && (
        <div className={styles.successBox}>
          <span className={styles.successTitle}>✓ Commitment Registered Successfully!</span>
          <p>
            You have committed to donate blood at <strong>{successCommitment.hospital}</strong> on {successCommitment.date} ({successCommitment.timeSlot}).
          </p>
          <p style={{ fontSize: '11px', opacity: 0.85 }}>
            Verify credentials on scan at check-in. This donation has been logged into your scheduler timeline.
          </p>
          <div style={{ alignSelf: 'flex-start' }}>
            <Button variant="outline" size="sm" onClick={() => setSuccessCommitment(null)}>
              Dismiss Notification
            </Button>
          </div>
        </div>
      )}

      <div className={styles.layout}>
        {/* Left Column: Compatible SOS Broadcasts */}
        <div ref={revealRef1 as any} className={`${styles.requestsSection} reveal`}>
          <h2 className={styles.sectionTitle}>Compatible Active SOS Alerts</h2>
          {compatibleRequests.length === 0 ? (
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-small)' }}>
              No critical matching emergency broadcasts found in your area at this time.
            </p>
          ) : (
            <div className={styles.requestsList}>
              {compatibleRequests.map((req) => (
                <div key={req.id} className={styles.requestItem}>
                  <div className={styles.requestInfo}>
                    <span className={styles.requestHospital}>{req.hospital}</span>
                    <span className={styles.requestMeta}>
                      Required: <strong style={{ color: 'var(--crimson)' }}>{req.bloodType}</strong> ({req.unitsNeeded} units) | Proximity: {req.distance} km
                    </span>
                    <span className={styles.requestMeta} style={{ textTransform: 'uppercase', color: req.urgency === 'critical' ? 'var(--status-critical)' : 'var(--status-low)' }}>
                      Urgency: {req.urgency}
                    </span>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleCommitToRequest(req)}>
                    Commit to Save Life
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: General Appointment form */}
        <div ref={revealRef2 as any} className={`${styles.formSection} reveal`}>
          <h2 className={styles.sectionTitle}>Register General Donation</h2>
          <form className={styles.form} onSubmit={handleGeneralSubmit}>
            <div className={styles.inputGroup}>
              <span className={styles.label}>Your Blood Group</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <BloodTypeBadge type={user.bloodType} size="md" />
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)' }}>Registered group</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Donation Center</span>
              <select
                className={styles.select}
                value={generalCenter}
                onChange={(e) => setGeneralCenter(e.target.value)}
              >
                <option value="City Central Donor Hub">City Central Donor Hub (1.2 km)</option>
                <option value="Apollo General Hospital">Apollo General Hospital (4.8 km)</option>
                <option value="Bandra Blood Bank Center">Bandra Blood Bank Center (7.5 km)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Preferred Date</span>
              <input
                type="date"
                className={styles.input}
                value={generalDate}
                onChange={(e) => setGeneralDate(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Time Slot</span>
              <select
                className={styles.select}
                value={generalTime}
                onChange={(e) => setGeneralTime(e.target.value)}
              >
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
              </select>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={!generalDate}>
              Confirm Commitment
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
