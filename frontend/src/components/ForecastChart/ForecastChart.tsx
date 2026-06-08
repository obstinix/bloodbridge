'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import { MOCK_FORECAST_DATA } from '@/lib/mockData';
import styles from './ForecastChart.module.css';

interface ForecastChartProps {
  className?: string;
}

export default function ForecastChart({
  className = '',
}: ForecastChartProps) {
  const [selectedType, setSelectedType] = useState<BloodType>('O-');
  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{data.date}</div>
          {data.historical !== null && (
            <div>Actual Demand: <strong>{data.historical} units</strong></div>
          )}
          {data.predicted !== null && (
            <div>Forecast: <strong>{data.predicted} units</strong></div>
          )}
          {data.lower !== null && data.upper !== null && (
            <div style={{ color: 'var(--ink-muted)' }}>
              Confidence Band: {data.lower} - {data.upper} units
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>ML Demand Forecast</h3>
          <span className={styles.subtitle}>
            14-day predictive modeling of emergency requests volume
          </span>
        </div>

        {/* Blood type selectors */}
        <div className={styles.chips}>
          {bloodTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`${styles.chip} ${
                selectedType === type ? styles.activeChip : ''
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={MOCK_FORECAST_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="predictionArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--crimson)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--crimson)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--hairline)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="var(--ink-subtle)"
              fontSize={10}
              tickLine={false}
              fontFamily="var(--font-mono)"
            />
            <YAxis
              stroke="var(--ink-subtle)"
              fontSize={10}
              tickLine={false}
              fontFamily="var(--font-mono)"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Confidence Band Area */}
            <Area
              type="monotone"
              dataKey={(d) => [d.lower, d.upper]}
              stroke="none"
              fill="var(--crimson)"
              fillOpacity={0.08}
              name="Confidence Band"
            />
            
            {/* Historical series line */}
            <Line
              type="monotone"
              dataKey="historical"
              stroke="var(--ink-muted)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
              name="Historical Volume"
            />
            
            {/* Predicted series line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--crimson)"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4, stroke: 'var(--crimson-soft)', strokeWidth: 2 }}
              name="ML Prediction"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
