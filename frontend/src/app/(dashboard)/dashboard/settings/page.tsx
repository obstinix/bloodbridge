'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com', role: 'donor', bloodType: 'O-' as BloodType });
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [bloodType, setBloodType] = useState<BloodType>('O-');
  const [showToast, setShowToast] = useState(false);
  const [saveLabel, setSaveLabel] = useState('Save Changes');

  // Notifications state
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [stockUpdates, setStockUpdates] = useState(true);
  const [campaignNews, setCampaignNews] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Donation Preferences
  const [preferredCenter, setPreferredCenter] = useState('City Central Donor Hub');
  const [maxDistance, setMaxDistance] = useState(15);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  useEffect(() => {
    // Read from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'John Doe',
          email: parsed.email || 'john@example.com',
          role: parsed.role || 'donor',
          bloodType: parsed.bloodType || 'O-',
        });
        setBloodType(parsed.bloodType || 'O-');
      } catch (e) {}
    }

    const savedSettings = localStorage.getItem('bb_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setPhone(parsed.phone || '');
        setCity(parsed.city || 'Mumbai');
        setEmergencyAlerts(parsed.emergencyAlerts !== false);
        setStockUpdates(parsed.stockUpdates !== false);
        setCampaignNews(!!parsed.campaignNews);
        setWeeklyDigest(!!parsed.weeklyDigest);
        setPreferredCenter(parsed.preferredCenter || 'City Central Donor Hub');
        setMaxDistance(parsed.maxDistance || 15);
      } catch (e) {}
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      phone,
      city,
      emergencyAlerts,
      stockUpdates,
      campaignNews,
      weeklyDigest,
      preferredCenter,
      maxDistance,
    };
    localStorage.setItem('bb_settings', JSON.stringify(settings));

    // Update root user record in local storage if blood type changed
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.bloodType = bloodType;
        parsed.name = user.name;
        localStorage.setItem('user', JSON.stringify(parsed));
      } catch (e) {}
    }

    setShowToast(true);
    setSaveLabel('✓ Saved');
    setTimeout(() => {
      setShowToast(false);
      setSaveLabel('Save Changes');
    }, 2400);
  };

  const handleDownloadData = () => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloodbridge-donor-data-${user.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill in password fields.');
      return;
    }
    alert('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account Settings</h1>

      {/* Profile Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>User Profile Details</h2>
        </div>
        <form className={styles.form} onSubmit={handleSaveProfile}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address (Read-only)</label>
              <input type="email" className={styles.input} value={user.email} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Current City</label>
              <input
                type="text"
                className={styles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {user.role === 'donor' && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Verify Blood Type</label>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="md" type="submit">
              {saveLabel}
            </Button>
          </div>
        </form>
      </section>

      {/* Notifications Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Notification Preferences</h2>
        </div>
        <div className={styles.form}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Emergency SOS Broadcasts</span>
              <span className={styles.toggleDesc}>Receive immediate notifications of nearby critical blood alerts.</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={emergencyAlerts}
                onChange={(e) => setEmergencyAlerts(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Blood Inventory Warnings</span>
              <span className={styles.toggleDesc}>Get notified when system forecasts projecting stock shortages.</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={stockUpdates}
                onChange={(e) => setStockUpdates(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Local Campaign Announcements</span>
              <span className={styles.toggleDesc}>Notifications for upcoming local collection drives.</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={campaignNews}
                onChange={(e) => setCampaignNews(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleMeta}>
              <span className={styles.toggleLabel}>Weekly System Digest</span>
              <span className={styles.toggleDesc}>Summary of total matches completed and community metrics.</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>
      </section>

      {/* Donation preferences */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Donation Preferences</h2>
        </div>
        <form className={styles.form} onSubmit={handleSaveProfile}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Preferred Donation Facility</label>
            <input
              type="text"
              className={styles.input}
              value={preferredCenter}
              onChange={(e) => setPreferredCenter(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.sliderMeta}>
              <span>Maximum Travel Proximity</span>
              <span>{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              className={styles.rangeInput}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="md" type="submit">
              Save Preferences
            </Button>
          </div>
        </form>
      </section>

      {/* Security & Account */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Security & Data Control</h2>
        </div>
        <div className={styles.formGrid}>
          {/* Change Password Form */}
          <form className={styles.form} onSubmit={handleChangePassword}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                className={styles.input}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button variant="outline" size="md" type="submit">
              Update Password
            </Button>
          </form>

          {/* Data controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Export Profile History</label>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)', marginBottom: 'var(--space-2)' }}>
                Download all your donor profile registration data, schedule entries, and badges.
              </p>
              <Button variant="outline" size="md" onClick={handleDownloadData}>
                Download My Data (JSON)
              </Button>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Danger Zone</label>
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--ink-muted)', marginBottom: 'var(--space-2)' }}>
                Permanently remove your credentials from the active response registry.
              </p>
              <div className={styles.tooltipContainer}>
                <Button variant="danger" size="md" disabled fullWidth>
                  Deactivate Account
                </Button>
                <span className={styles.tooltipText}>Account deletion requires master administrator approval.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sliding toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          backgroundColor: 'var(--canvas-overlay)',
          border: '1px solid var(--status-adequate)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-5)',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-small)',
          color: 'var(--status-adequate)',
          boxShadow: 'var(--shadow-elevated)',
          animation: 'slideInRight 300ms var(--ease-out)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <span>✓</span> Settings saved successfully
        </div>
      )}
    </div>
  );
}
