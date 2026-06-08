'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './widget.module.css';

const HOSPITALS = [
  { id: 'all', name: 'All Facilities (Aggregated)' },
  { id: 'GH001', name: 'City General Hospital' },
  { id: 'AE002', name: 'Apollo Emergency Care' },
  { id: 'LH003', name: 'Lilavati Hospital' },
];

const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function WidgetConfiguratorPage() {
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(BLOOD_TYPES);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [origin, setOrigin] = useState<string>('https://bloodbridge.app');
  const [copied, setCopied] = useState<boolean>(false);

  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleCheckboxChange = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Enforce at least one type selected
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const embedSrc = `${origin}/widget/embed?hospital=${selectedHospital}&theme=${theme}&types=${selectedTypes.join(',')}`;

  const embedCode = `<iframe src="${embedSrc}"\n        width="400" height="360" frameborder="0"\n        style="border-radius: 8px; border: none;"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Public Inventory Embed Widget</h1>
        <p className={styles.subtitle}>
          Configure and embed BloodBridge real-time inventory statistics directly into your hospital portal or news website.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Left column: Controls */}
        <div ref={revealRef1 as any} className={`${styles.configCard} reveal`}>
          <div className={styles.controlGroup}>
            <span className={styles.label}>Select Facility</span>
            <select
              className={styles.select}
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              {HOSPITALS.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>Show Blood Types</span>
            <div className={styles.checkboxList}>
              {BLOOD_TYPES.map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <span className={styles.label}>Widget Theme</span>
            <select
              className={styles.select}
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </div>

          <div className={styles.controlGroup} style={{ marginTop: 'var(--space-2)' }}>
            <span className={styles.label}>Generated Embed Code</span>
            <textarea
              className={styles.codeArea}
              readOnly
              value={embedCode}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>

          <Button variant="primary" fullWidth onClick={copyToClipboard}>
            {copied ? 'Code Copied!' : 'Copy Embed Code'}
          </Button>
        </div>

        {/* Right column: Live preview */}
        <div ref={revealRef2 as any} className={`${styles.previewSection} reveal`}>
          <span className={styles.previewTitle}>Live Preview (400 × 360)</span>
          <div className={styles.iframeWrapper}>
            <iframe
              src={embedSrc}
              width="400"
              height="360"
              frameBorder="0"
              style={{ borderRadius: '8px', border: 'none', background: theme === 'dark' ? 'var(--canvas)' : '#F5F3F4' }}
              title="BloodBridge Public Embed Widget Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
