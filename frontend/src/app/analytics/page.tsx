'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav/TopNav';
import StatsCard from '@/components/StatsCard/StatsCard';
import ForecastChart from '@/components/ForecastChart/ForecastChart';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './analytics.module.css';

// Custom Formatted Tooltip
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--canvas-overlay)',
        border: '1px solid var(--hairline-mid)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--ink)',
        boxShadow: 'var(--shadow-elevated)',
      }}
    >
      <div style={{ color: 'var(--ink-muted)', marginBottom: 6, fontSize: 11 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || p.fill, marginTop: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

// Custom Rounded Top Bar Shape
function RoundedBar(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height < 0) return null;
  const r = 4;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.replace('/login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== 'admin') {
        router.replace('/dashboard/donor');
        return;
      }
    } catch {}
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  const revealRef1 = useScrollReveal({ threshold: 0.1 });
  const revealRef2 = useScrollReveal({ threshold: 0.1 });
  const revealRef3 = useScrollReveal({ threshold: 0.1 });
  const revealRef4 = useScrollReveal({ threshold: 0.1 });

  const barData = [
    { name: 'O-', value: 45, fill: 'var(--crimson)' },
    { name: 'O+', value: 120, fill: 'var(--crimson-soft)' },
    { name: 'A-', value: 25, fill: 'var(--blood-a)' },
    { name: 'A+', value: 85, fill: 'rgba(232, 168, 56, 0.6)' },
    { name: 'B-', value: 18, fill: 'var(--blood-b)' },
    { name: 'B+', value: 65, fill: 'rgba(56, 168, 232, 0.6)' },
    { name: 'AB-', value: 10, fill: 'var(--blood-ab)' },
    { name: 'AB+', value: 38, fill: 'rgba(155, 89, 232, 0.6)' },
  ];

  const subTrendData = [
    { name: 'Jan', subscribers: 240 },
    { name: 'Feb', subscribers: 310 },
    { name: 'Mar', subscribers: 450 },
    { name: 'Apr', subscribers: 520 },
    { name: 'May', subscribers: 680 },
    { name: 'Jun', subscribers: 890 },
  ];

  const pieData = [
    { name: 'Hospitals', value: 145, fill: '#3B8BEB' },
    { name: 'Blood Banks', value: 92, fill: 'var(--crimson)' },
    { name: 'Clinics', value: 45, fill: 'var(--status-low)' },
    { name: 'NGOs', value: 30, fill: 'var(--status-adequate)' },
  ];

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

  // Custom Dot for Area Chart - final point only
  const renderCustomDot = (props: any) => {
    const { cx, cy, index } = props;
    if (index === subTrendData.length - 1) {
      return (
        <circle
          key={`dot-${index}`}
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--status-adequate)"
          stroke="var(--ink)"
          strokeWidth={1.5}
        />
      );
    }
    return null;
  };

  // Dynamic Pie Text
  const activePieSector = activePieIndex !== null ? pieData[activePieIndex] : null;
  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.container}>
      <TopNav />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>System Analytics</h1>
            <p className={styles.subtitle}>ML predictions and demographic metrics overview.</p>
          </div>

          <button className={styles.datePicker} onClick={handleToggleRange}>
            <span>📅</span>
            <span>{dateRange}</span>
          </button>
        </div>

        {/* Row 1: KPI Stats */}
        <div className={`${styles.statsGrid} stagger`}>
          <StatsCard value="312" label="Requests This Month" delta="+12%" deltaPositive={true} />
          <StatsCard value="94.8%" label="Fulfillment Rate" status="adequate" />
          <StatsCard value="2.4 hrs" label="Avg Response Time" delta="-8%" deltaPositive={true} />
          <StatsCard value="O- Negative" label="Top Needed Blood Type" status="critical" />
        </div>

        {/* Row 2: Forecasting */}
        <div ref={revealRef1 as any} className={`${styles.chartSection} reveal`}>
          <h2 className={styles.sectionTitle}>Demand Supply Predictions (Next 14 Days)</h2>
          <ForecastChart />
        </div>

        {/* Row 3: Split Charts */}
        <div className={styles.rowSplit}>
          {/* Left: Donation Frequency by Blood Type */}
          <div ref={revealRef2 as any} className={`${styles.gridCard} reveal`}>
            <h3 className={styles.gridCardTitle}>Donation reserves by blood type (Units)</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--hairline)" strokeDasharray="4 4" vertical={false} strokeOpacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--ink-subtle)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-subtle)' }}
                  />
                  <YAxis
                    stroke="var(--ink-subtle)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-subtle)' }}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--canvas-high)' }} />
                  <ReferenceLine y={30} stroke="var(--status-low)" strokeDasharray="6 3" />
                  <Bar
                    dataKey="value"
                    shape={<RoundedBar />}
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {barData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--crimson)', borderRadius: '50%' }} />
                <span>Type O</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--blood-a)', borderRadius: '50%' }} />
                <span>Type A</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--blood-b)', borderRadius: '50%' }} />
                <span>Type B</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--blood-ab)', borderRadius: '50%' }} />
                <span>Type AB</span>
              </div>
            </div>
          </div>

          {/* Right: Trend Line */}
          <div ref={revealRef3 as any} className={`${styles.gridCard} reveal`}>
            <h3 className={styles.gridCardTitle}>Active Registered Donors Trend</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={subTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#27AE60" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#27AE60" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--hairline)" strokeDasharray="4 4" vertical={false} strokeOpacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--ink-subtle)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-subtle)' }}
                  />
                  <YAxis
                    stroke="var(--ink-subtle)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--ink-subtle)' }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={800} stroke="var(--ink-subtle)" strokeDasharray="6 3" />
                  <Area
                    type="monotone"
                    name="Donors"
                    dataKey="subscribers"
                    stroke="var(--status-adequate)"
                    strokeWidth={2}
                    fill="url(#subGrad)"
                    dot={renderCustomDot}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 4: Donut Chart & Heatmap */}
        <div className={styles.rowSplit}>
          {/* Facility Type Donut */}
          <div ref={revealRef4 as any} className={`${styles.gridCard} reveal`}>
            <h3 className={styles.gridCardTitle}>Emergency Request distribution by Facility</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="56%"
                    outerRadius="78%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Dynamic Center Label */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -60%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: 'bold', color: 'var(--ink)', lineHeight: 1 }}>
                  {activePieSector ? activePieSector.value : pieTotal}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', marginTop: 4 }}>
                  {activePieSector ? activePieSector.name : 'Total Requests'}
                </div>
              </div>

              {/* Custom Legend */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '11px', fontFamily: 'var(--font-ui)', marginTop: '8px' }}>
                {pieData.map((item, idx) => (
                  <div
                    key={item.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: activePieIndex === null || activePieIndex === idx ? 1 : 0.4,
                      transition: 'opacity 200ms ease',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', backgroundColor: item.fill, borderRadius: '50%' }} />
                    <span style={{ color: 'var(--ink-muted)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap */}
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
                      {tile.rate} alert rate
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
