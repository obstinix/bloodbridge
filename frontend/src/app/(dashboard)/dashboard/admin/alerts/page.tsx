'use client';

import React, { useState, useEffect } from 'react';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import Button from '@/components/Button/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './alerts.module.css';

interface Alert {
  bloodType: BloodType;
  currentUnits: number;
  maxCapacity: number;
  forecastPoints: number[]; // 7 points
  daysUntilCritical: number; // 0 if already critical, or N days
  predictedMinUnits: number;
  severity: 'critical' | 'warning';
  title: string;
}

interface Reminder {
  id: string;
  bloodType: BloodType;
  severity: string;
  createdAt: string;
  note: string;
}

const THRESHOLDS = { critical: 0.2, low: 0.4 };

// Mock data structure to analyze and generate alerts
const MOCK_INVENTORY_ALERTS = [
  { bloodType: 'O-' as BloodType, units: 9, maxCapacity: 200, forecast: [9, 8, 7, 5, 4, 3, 2] },
  { bloodType: 'AB-' as BloodType, units: 11, maxCapacity: 100, forecast: [11, 10, 9, 8, 7, 6, 5] },
  { bloodType: 'B-' as BloodType, units: 22, maxCapacity: 200, forecast: [22, 20, 18, 15, 12, 10, 8] },
  { bloodType: 'A-' as BloodType, units: 48, maxCapacity: 200, forecast: [48, 45, 43, 39, 36, 33, 30] },
  { bloodType: 'AB+' as BloodType, units: 89, maxCapacity: 200, forecast: [89, 85, 82, 77, 73, 70, 68] },
];

export default function PredictiveAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeCampaignAlert, setActiveCampaignAlert] = useState<Alert | null>(null);
  const [campaignText, setCampaignText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const revealRefGrid = useScrollReveal();
  const revealRefReminders = useScrollReveal();

  useEffect(() => {
    // Generate alerts based on threshold analysis
    const generated: Alert[] = MOCK_INVENTORY_ALERTS.map(item => {
      const critLimit = item.maxCapacity * THRESHOLDS.critical;
      const warningLimit = item.maxCapacity * THRESHOLDS.low;
      
      let daysUntilCritical = -1;
      let predictedMinUnits = Math.min(...item.forecast);

      // Find first index where forecast drops below critical limit
      for (let d = 0; d < item.forecast.length; d++) {
        if (item.forecast[d] < critLimit) {
          daysUntilCritical = d;
          break;
        }
      }

      const isCurrentlyCritical = item.units < critLimit;
      const isCurrentlyWarning = item.units < warningLimit;

      let severity: 'critical' | 'warning' = 'warning';
      let title = '';

      if (isCurrentlyCritical || (daysUntilCritical >= 0 && daysUntilCritical <= 3)) {
        severity = 'critical';
        title = isCurrentlyCritical 
          ? `CRITICAL SHORTAGE ACTIVE` 
          : `PREDICTED CRITICAL IN ${daysUntilCritical} DAYS`;
      } else {
        severity = 'warning';
        title = isCurrentlyWarning 
          ? `LOW STOCK WARNING ACTIVE` 
          : `PREDICTED DEPLOYMENT IN ${daysUntilCritical >= 0 ? daysUntilCritical : 7} DAYS`;
      }

      return {
        bloodType: item.bloodType,
        currentUnits: item.units,
        maxCapacity: item.maxCapacity,
        forecastPoints: item.forecast,
        daysUntilCritical: daysUntilCritical >= 0 ? daysUntilCritical : 7,
        predictedMinUnits,
        severity,
        title,
      };
    });

    setAlerts(generated);

    // Read reminders from localStorage
    const savedReminders = localStorage.getItem('bb_reminders');
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {}
    } else {
      const defaultReminders = [
        {
          id: 'rem-1',
          bloodType: 'O-' as BloodType,
          severity: 'critical',
          createdAt: '2026-06-08 14:32',
          note: 'Emergency donor call scheduled for O- group.'
        }
      ];
      setReminders(defaultReminders);
      localStorage.setItem('bb_reminders', JSON.stringify(defaultReminders));
    }
  }, []);

  const handleSetReminder = (alert: Alert) => {
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      bloodType: alert.bloodType,
      severity: alert.severity,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      note: `Monitor stock decay. Predicted minimum: ${alert.predictedMinUnits} units.`
    };
    
    const updated = [newReminder, ...reminders];
    setReminders(updated);
    localStorage.setItem('bb_reminders', JSON.stringify(updated));
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('bb_reminders', JSON.stringify(updated));
  };

  const openCampaignModal = (alert: Alert) => {
    setActiveCampaignAlert(alert);
    const template = `Subject: Urgent Blood Donation Drive — Type ${alert.bloodType} Needed

BloodBridge is projecting a critical shortage of ${alert.bloodType} within ${alert.daysUntilCritical} days.
Your donation today can directly save lives.

Nearest centre: City Central Donor Hub
Walk-ins accepted daily 8AM–6PM
Register at bloodbridge.app/donate`;
    setCampaignText(template);
    setCopied(false);
  };

  const copyCampaignToClipboard = () => {
    navigator.clipboard.writeText(campaignText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Renders the mini sparkline SVG
  const renderSparkline = (points: number[], maxCapacity: number, severity: 'critical' | 'warning') => {
    const width = 120;
    const height = 40;
    const padding = 4;
    
    // Scale points to fit the height
    const maxVal = maxCapacity;
    const minVal = 0;
    const yRange = maxVal - minVal;
    
    const xStep = (width - padding * 2) / (points.length - 1);
    
    const svgPoints = points.map((p, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((p - minVal) / yRange) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    // Threshold lines
    const threshPercent = severity === 'critical' ? THRESHOLDS.critical : THRESHOLDS.low;
    const threshVal = maxCapacity * threshPercent;
    const threshY = height - padding - ((threshVal - minVal) / yRange) * (height - padding * 2);

    const strokeColor = severity === 'critical' ? 'var(--status-critical)' : 'var(--status-low)';

    return (
      <svg width={width} height={height} className={styles.sparklineWrapper}>
        {/* Threshold indicator line */}
        <line 
          x1={0} 
          y1={threshY} 
          x2={width} 
          y2={threshY} 
          stroke="var(--hairline-strong)" 
          strokeDasharray="3 3" 
        />
        {/* Trend Polyline */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={svgPoints}
        />
        {/* Last data point dot */}
        {points.length > 0 && (
          <circle
            cx={padding + (points.length - 1) * xStep}
            cy={height - padding - ((points[points.length - 1] - minVal) / yRange) * (height - padding * 2)}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Predictive Shortage Alerts</h1>
        <p className={styles.subtitle}>
          Machine learning algorithms forecasting demand trends. Below alerts reflect simulated inventory drops within the next 14 days.
        </p>
      </div>

      {/* Alerts Grid */}
      <div ref={revealRefGrid as any} className={`${styles.alertsGrid} stagger reveal`}>
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const cardBorderColor = isCritical ? 'var(--status-critical)' : 'var(--status-low)';
          
          return (
            <div 
              key={alert.bloodType} 
              className={`${styles.alertCard} reveal`}
              style={{ borderLeft: `3px solid ${cardBorderColor}` }}
            >
              <div className={styles.cardHeader}>
                <BloodTypeBadge type={alert.bloodType} size="md" />
                <span className={`${styles.severityChip} ${isCritical ? styles.chipCritical : styles.chipWarning}`}>
                  {alert.title}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.metrics}>
                  <span className={styles.metricLabel}>Current stock level</span>
                  <span className={styles.metricValue}>{alert.currentUnits} / {alert.maxCapacity} units</span>
                  
                  <span className={styles.metricLabel} style={{ marginTop: 'var(--space-2)' }}>Forecasted minimum</span>
                  <span className={styles.metricValue} style={{ color: cardBorderColor }}>
                    {alert.predictedMinUnits} units
                  </span>
                </div>

                {renderSparkline(alert.forecastPoints, alert.maxCapacity, alert.severity)}
              </div>

              <div className={styles.cardActions}>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => openCampaignModal(alert)}
                >
                  Launch Campaign
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetReminder(alert)}
                >
                  Set Reminder
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reminders List */}
      <div ref={revealRefReminders as any} className={`${styles.remindersSection} reveal`}>
        <h2 className={styles.remindersTitle}>Active Monitoring Reminders</h2>
        {reminders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)', fontSize: 'var(--text-small)' }}>
            No monitoring reminders set.
          </p>
        ) : (
          <div className={styles.reminderTimeline}>
            {reminders.map((rem) => (
              <div key={rem.id} className={styles.reminderItem}>
                <div 
                  className={styles.reminderDot} 
                  style={{ backgroundColor: rem.severity === 'critical' ? 'var(--status-critical)' : 'var(--status-low)' }}
                />
                <div className={styles.reminderContent}>
                  <span className={styles.reminderText}>
                    Verify supply for Group <strong style={{ fontFamily: 'var(--font-mono)' }}>{rem.bloodType}</strong>. {rem.note}
                  </span>
                  <span className={styles.reminderMeta}>Created: {rem.createdAt}</span>
                </div>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteReminder(rem.id)}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Draft Modal */}
      {activeCampaignAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Campaign Draft (Type {activeCampaignAlert.bloodType})</div>
            <textarea
              className={styles.textarea}
              value={campaignText}
              onChange={(e) => setCampaignText(e.target.value)}
            />
            <div className={styles.modalActions}>
              <Button 
                variant="outline" 
                onClick={() => setActiveCampaignAlert(null)}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={copyCampaignToClipboard}
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
