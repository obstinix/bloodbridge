'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'hospital'>('donor');
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Mock registration
    setTimeout(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          name,
          email,
          role,
          bloodType: role === 'donor' ? bloodType : undefined,
        })
      );
      setLoading(false);
      router.push(`/dashboard/${role}`);
    }, 800);
  };

  return (
    <div className={styles.splitLayout}>
      {/* Left Info Panel */}
      <div className={styles.leftPanel}>
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, pointerEvents: 'none' }}
          viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none" stroke="var(--crimson)" strokeWidth="1"
            strokeDasharray="80 600" strokeLinecap="round"
            d="M -80 200 H 120 L 160 240 H 280 L 320 200 H 480"
            style={{ animation: 'lineFlow 9s linear infinite' }}
          />
          <path
            fill="none" stroke="var(--crimson)" strokeWidth="0.6"
            strokeDasharray="50 800" strokeLinecap="round"
            d="M -60 350 H 100 L 140 380 H 300 L 340 350 H 480"
            style={{ animation: 'lineFlow 12s linear infinite 2s', opacity: 0.5 }}
          />
        </svg>
        <div className={styles.leftContent}>
          <div className={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--crimson)">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <span>BloodBridge</span>
          </div>
          <p className={styles.tagline}>
            Every second counts in an emergency. Join our active response network.
          </p>
          <div className={styles.miniStats}>
            <div className={styles.statRow}>
              <span>Partner Hospitals</span>
              <span className={styles.statVal}>847 Verified</span>
            </div>
            <div className={styles.statRow}>
              <span>Active Donors</span>
              <span className={styles.statVal}>12.8k Registered</span>
            </div>
            <div className={styles.statRow}>
              <span>Fulfillment rate</span>
              <span className={styles.statVal}>99.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div>
            <h1 className={styles.formTitle}>Register</h1>
            <p className={styles.formDesc}>Create your account to join the network.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name / Facility Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="John Doe or City Hospital"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Join As</label>
              <div className={styles.roleGrid}>
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`${styles.roleCard} ${
                    role === 'donor' ? styles.roleCardActive : ''
                  }`}
                >
                  <span className={styles.roleIcon}>👤</span>
                  <span className={styles.roleLabel}>Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('hospital')}
                  className={`${styles.roleCard} ${
                    role === 'hospital' ? styles.roleCardActive : ''
                  }`}
                >
                  <span className={styles.roleIcon}>🏥</span>
                  <span className={styles.roleLabel}>Hospital</span>
                </button>
              </div>
            </div>

            {role === 'donor' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Select Blood Type</label>
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
            )}

            <Button variant="primary" size="lg" type="submit" loading={loading} fullWidth>
              Register
            </Button>
          </form>

          <p className={styles.footerLink}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
