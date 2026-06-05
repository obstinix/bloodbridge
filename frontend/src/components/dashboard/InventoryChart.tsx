'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BloodGroup } from '@/constants/bloodGroups';

interface InventoryChartData {
  bloodGroup: BloodGroup;
  units: number;
}

interface InventoryChartProps {
  data: InventoryChartData[];
}

export default function InventoryChart({ data }: InventoryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-xs text-gray-400">Loading supply data...</div>;
  }

  const getBarColor = (units: number) => {
    if (units < 5) return '#DC2626'; // critical
    if (units < 20) return '#F77F00'; // low
    return '#A4161A'; // normal
  };

  return (
    <div className="w-full h-64 font-body">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.04)" />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="bloodGroup"
            tick={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}
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
            cursor={{ fill: 'rgba(0,0,0,0.01)' }}
          />
          <Bar dataKey="units" radius={[0, 4, 4, 0]} barSize={12}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.units)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
