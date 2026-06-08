'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import TopNav from '@/components/TopNav/TopNav';
import StatsCard from '@/components/StatsCard/StatsCard';
import ForecastChart from '@/components/ForecastChart/ForecastChart';
import styles from './analytics.module.css';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const barData = [
    { name: 'O-', value: 45 },
    { name: 'O+', value: 120 },
    { name: 'A-', value: 25 },
    { name: 'A+', value: 85 },
    { name: 'B-', value: 18 },
    { name: 'B+', value: 65 },
    { name: 'AB-', value: 10 },
    { name: 'AB+', value: 38 },
  ];

  const pieData = [
    { name: 'Public Hospitals', value: 40 },
    { name: 'Private Clinics', value: 30 },
    { name: 'Trauma Centers', value: 20 },
    { name: 'Military/Field Care', value: 10 },
  ];

  const COLORS = ['var(--crimson)', 'var(--blood-a)', 'var(--blood-b)', 'var(--blood-ab)'];

  const heatmapData = [
    { region: 'Mumbai Central', rate: 84, status: 'critical' },
    { region: 'Bandra West', rate: 62, status: 'low' },
    { region: 'Andheri East', rate: 45, status: 'adequate' },
    { region: 'Colaba Hub', rate: 15, status: 'surplus' },
    { region: 'Thane General', rate: 76, status: 'critical' },
    { region: 'Dadar Clinic', rate: 53, status: 'low' },
    { region: 'Borivali Center', rate: 30, status: 'adequate' },
    { region: 'Kurla Emergency', rate: 89, status: 'critical' },
  ];

  const handleToggleRange = () => {
    const ranges = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'];
    const nextIdx = (ranges.indexOf(dateRange) + 1) % ranges.length;
    setDateRange(ranges[nextIdx]);
  };

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Blood Demand Analytics</h1>
            <p className={styles.subtitle}>ML predictions and demographic metrics overview.</p>
          </div>

          <button className={styles.datePicker} onClick={handleToggleRange}>
            <span>📅</span>
            <span>{dateRange}</span>
          </button>
        </div>

        {/* Row 1: KPI Stats */}
        <div className={styles.statsGrid}>
          <StatsCard value="312" label="Requests This Month" delta="+12%" deltaPositive={true} />
          <StatsCard value="94.8%" label="Fulfillment Rate" status="adequate" />
          <StatsCard value="2.4 hrs" label="Avg Response Time" delta="-8%" deltaPositive={true} />
          <StatsCard value="O- Negative" label="Top Needed Blood Type" status="critical" />
        </div>

        {/* Row 2: Forecasting */}
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Demand Supply Predictions (Next 14 Days)</h2>
          <ForecastChart />
        </div>

        {/* Row 3: Split Charts */}
        <div className={styles.rowSplit}>
          {/* Left: Donation Frequency by Blood Type */}
          <div className={styles.gridCard}>
            <h3 className={styles.gridCardTitle}>Donation Subscriptions by Blood Type</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
                  <XAxis dataKey="name" stroke="var(--ink-subtle)" tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
                  <YAxis stroke="var(--ink-subtle)" tick={{ fontFamily: 'var(--font-mono)', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--canvas-overlay)', borderColor: 'var(--hairline-strong)', color: 'var(--ink)' }}
                  />
                  <Bar dataKey="value" fill="var(--crimson)">
                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name.startsWith('O')
                            ? 'var(--crimson)'
                            : entry.name.startsWith('A')
                            ? 'var(--blood-a)'
                            : entry.name.startsWith('B')
                            ? 'var(--blood-b)'
                            : 'var(--blood-ab)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Hospital Requests Share */}
          <div className={styles.gridCard}>
            <h3 className={styles.gridCardTitle}>Emergency Share by Facility Type</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--canvas-overlay)', borderColor: 'var(--hairline-strong)', color: 'var(--ink)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  width: '100%',
                  flexWrap: 'wrap',
                  fontSize: '11px',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {pieData.map((item, idx) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: COLORS[idx], borderRadius: '50%' }} />
                    <span style={{ color: 'var(--ink-muted)' }}>
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Heatmap grid */}
        <div className={styles.heatmapSection}>
          <h3 className={styles.sectionTitle}>Regional Demand Alert Intensity Heatmap</h3>
          <p className={styles.subtitle} style={{ marginTop: '-8px', marginBottom: '16px' }}>
            Identifies emergency broadcast spikes across municipal wards.
          </p>
          <div className={styles.heatmapGrid}>
            {heatmapData.map((tile) => {
              let borderClass = 'var(--hairline)';
              let labelColor = 'var(--ink-muted)';
              if (tile.status === 'critical') {
                borderClass = 'var(--status-critical)';
                labelColor = 'var(--status-critical)';
              } else if (tile.status === 'low') {
                borderClass = 'var(--status-low)';
                labelColor = 'var(--status-low)';
              } else if (tile.status === 'adequate') {
                borderClass = 'var(--status-adequate)';
              }
              return (
                <div key={tile.region} className={styles.heatmapTile} style={{ borderLeft: `3px solid ${borderClass}` }}>
                  <span className={styles.tileName}>{tile.region}</span>
                  <span className={styles.tileValue} style={{ color: labelColor }}>
                    {tile.rate} emergency rate
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
