'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { Calendar } from 'lucide-react';

export default function DemandForecastChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const forecastData = [
    { day: 'Day 1', demand: 180, projection: 185 },
    { day: 'Day 5', demand: 195, projection: 200 },
    { day: 'Day 10', demand: 210, projection: 225 },
    { day: 'Day 15', demand: 320, projection: 310 }, // Festival Peak
    { day: 'Day 20', demand: 240, projection: 235 },
    { day: 'Day 25', demand: 190, projection: 195 },
    { day: 'Day 30', demand: 185, projection: 180 },
  ];

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-xs text-gray-400">Loading demand models...</div>;
  }

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 font-body">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
          AI Demand Forecast Model
        </h3>
        <p className="text-[10px] text-gray-400">30-day projected blood bank consumption demands.</p>
      </div>

      {/* Chart */}
      <div className="w-full h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #E2DCDC',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <ReferenceArea x1="Day 10" x2="Day 20" stroke="rgba(247,127,0,0.1)" fill="rgba(247,127,0,0.05)" />
            <Line type="monotone" dataKey="demand" stroke="#A4161A" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="projection" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Note Section */}
      <div className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 border border-border dark:border-border-dk rounded">
        <Calendar className="w-4 h-4 text-gray-500 dark:text-slate-400 mt-0.5" />
        <div>
          <h5 className="text-[10px] font-bold text-[var(--color-text)] dark:text-white">Upcoming Peak Event</h5>
          <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
            Ganesh Festival +40% demand forecast Oct 2–5 Nashik. Consider pre-scheduling blood drives 1 week prior.
          </p>
        </div>
      </div>
    </div>
  );
}
