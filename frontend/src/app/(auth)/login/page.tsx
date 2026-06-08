'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'hospital' | 'admin'>('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Mock verification
    setTimeout(() => {
      let name = 'John Doe';
      if (role === 'hospital') {
        name = 'City General Hospital';
      } else if (role === 'admin') {
        name = 'Admin Controller';
      }

      localStorage.setItem(
        'user',
        JSON.stringify({
          email,
          name,
          role,
          bloodType: role === 'donor' ? 'O-' : undefined,
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
            Connecting critical blood supplies to emergency medical services in real time.
          </p>
          <div className={styles.miniStats}>
            <div className={styles.statRow}>
              <span>Active Emergencies</span>
              <span className={`${styles.statVal} [color:var(--crimson)]`}>3 Live</span>
            </div>
            <div className={styles.statRow}>
              <span>Average Match Speed</span>
              <span className={styles.statVal}>2.4m</span>
            </div>
            <div className={styles.statRow}>
              <span>Active Network Status</span>
              <span className={styles.statVal} style={{ color: 'var(--status-adequate)' }}>Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div>
            <h1 className={styles.formTitle}>Sign In</h1>
            <p className={styles.formDesc}>Access the emergency blood network dashboard.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorText} style={{ marginBottom: '10px' }}>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
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
              <label className={styles.label}>Select Redesign Role View</label>
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

            <Button variant="primary" size="lg" type="submit" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          <p className={styles.footerLink}>
            Don't have an account? <Link href="/register">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
