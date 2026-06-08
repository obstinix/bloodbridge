'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequestCard from '@/components/RequestCard/RequestCard';
import { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import Button from '@/components/Button/Button';
import styles from './submit-request.module.css';

export default function SubmitRequestPage() {
  const router = useRouter();
  const [hospitalName, setHospitalName] = useState('City General Hospital');
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [units, setUnits] = useState(4);
  const [urgency, setUrgency] = useState<'standard' | 'urgent' | 'critical'>('critical');
  const [requiredBy, setRequiredBy] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');

  const [requestId, setRequestId] = useState<string | null>(null);

  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setHospitalName(parsed.name || 'City General Hospital');
      } catch (e) {}
    }
  }, []);

  const handleIncrement = () => setUnits((prev) => Math.min(prev + 1, 20));
  const handleDecrement = () => setUnits((prev) => Math.max(prev - 1, 1));

  const getMatchedDonors = () => {
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

  const getBroadcastRadius = () => {
    switch (urgency) {
      case 'critical': return 12.5;
      case 'urgent': return 8.4;
      case 'standard':
      default: return 5.0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorName || !doctorPhone) {
      alert('Please enter contact physician details.');
      return;
    }

    const newId = `req-${Date.now().toString().slice(-6)}`;
    setRequestId(newId);

    // Save to localStorage
    const savedRequests = localStorage.getItem('bb_hospital_requests');
    const requestsList = savedRequests ? JSON.parse(savedRequests) : [];
    const newReq = {
      id: newId,
      bloodType,
      unitsNeeded: units,
      urgency,
      requiredBy,
      notes,
      doctorName,
      doctorPhone,
      postedAt: 'Just now',
      status: 'Dispatching Alerts',
      matchedDonors: getMatchedDonors(),
    };
    localStorage.setItem('bb_hospital_requests', JSON.stringify([newReq, ...requestsList]));

    alert(`Emergency request ${newId} has been successfully broadcast!`);
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Submit Emergency Blood Request</h1>
        <p className={styles.subtitle}>Broadcast live request alerts to eligible donors in proximity range.</p>
      </div>

      {requestId ? (
        <div style={{ backgroundColor: 'var(--canvas-raised)', border: '1px solid var(--status-adequate)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '32px' }}>✓</span>
          <h2 style={{ fontFamily: 'var(--font-ui)', color: 'var(--ink)' }}>Alert Broadcaster Dispatched</h2>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)' }}>
            Your request has been successfully registered on the emergency response feeds.
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body)', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', padding: 'var(--space-3) 0', backgroundColor: 'var(--canvas)', borderRadius: 'var(--radius-sm)' }}>
            ID: {requestId}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Button variant="outline" size="sm" onClick={() => setRequestId(null)}>
              Submit Another
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/emergency')}>
              View Active Requests →
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Left Column: Form */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Request Parameters</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Blood Type Badge click list */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Required Blood Type</label>
                <div className={styles.bloodGrid}>
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBloodType(type)}
                      className={`${styles.bloodPill} ${
                        bloodType === type ? styles.bloodPillActive : ''
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units needed with steppers */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Units Required (450ml units)</label>
                <div className={styles.stepperWrapper}>
                  <button type="button" onClick={handleDecrement} className={styles.stepperBtn}>
                    −
                  </button>
                  <input
                    type="text"
                    readOnly
                    className={styles.stepperInput}
                    value={units}
                  />
                  <button type="button" onClick={handleIncrement} className={styles.stepperBtn}>
                    +
                  </button>
                </div>
              </div>

              {/* Urgency selection */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Urgency Severity</label>
                <div className={styles.urgencyGrid}>
                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`${styles.urgencyCard} ${
                      urgency === 'standard' ? styles.urgencyCardStandardActive : ''
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`${styles.urgencyCard} ${
                      urgency === 'urgent' ? styles.urgencyCardUrgentActive : ''
                    }`}
                  >
                    Urgent
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('critical')}
                    className={`${styles.urgencyCard} ${
                      urgency === 'critical' ? styles.urgencyCardCriticalActive : ''
                    }`}
                  >
                    Critical
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Required By Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={requiredBy}
                  onChange={(e) => setRequiredBy(e.target.value)}
                  required
                />
              </div>

              {/* Contact Physicians */}
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Attending Physician</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Dr. Sarah Connor"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Emergency Phone</label>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="+1 (555) 123-4567"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Patient Notes */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Patient Diagnostic / Delivery Notes</label>
                <textarea
                  className={styles.textarea}
                  placeholder="E.g., Patient scheduled for bypass surgery, deliver directly to OR Room 4, contact blood lab supervisor upon arrival..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button variant="danger" size="lg" type="submit">
                Broadcast Request Alert
              </Button>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className={styles.previewSection}>
            <h2 className={styles.sectionTitle}>Live Broadcast Preview</h2>
            <RequestCard
              id="req-preview"
              bloodType={bloodType}
              unitsNeeded={units}
              urgency={urgency}
              hospital={hospitalName}
              location="Mumbai Central"
              distance={1.2}
              postedAt="Just now"
            />

            <div className={styles.previewMeta}>
              <div className={styles.previewMetaRow}>
                <span>Target Donors:</span>
                <span className={styles.previewVal}>{getMatchedDonors()} Matching</span>
              </div>
              <div className={styles.previewMetaRow}>
                <span>Coverage Radius:</span>
                <span className={styles.previewVal}>{getBroadcastRadius()} km</span>
              </div>
              <div className={styles.previewMetaRow}>
                <span>Dispatch Mode:</span>
                <span className={urgency === 'critical' ? styles.previewValCritical : styles.previewVal}>
                  {urgency === 'critical' ? 'IMMEDIATE SMS/PUSH' : 'STANDARD ALERT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
