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
  const [role, setRole] = useState<'donor' | 'hospital' | 'admin'>('donor');
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
        <div className={styles.leftContent}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>🩸</span>
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
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`${styles.roleCard} ${
                    role === 'admin' ? styles.roleCardActive : ''
                  }`}
                >
                  <span className={styles.roleIcon}>⚙️</span>
                  <span className={styles.roleLabel}>Admin</span>
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
