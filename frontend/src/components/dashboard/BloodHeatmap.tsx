'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function BloodHeatmap() {
  const regions = [
    { city: 'Mumbai', 'A+': 'Adequate', 'O-': 'Shortage', 'B+': 'Adequate', 'AB-': 'Critical' },
    { city: 'Pune', 'A+': 'Low', 'O-': 'Adequate', 'B+': 'Adequate', 'AB-': 'Adequate' },
    { city: 'Nashik', 'A+': 'Critical', 'O-': 'Low', 'B+': 'Adequate', 'AB-': 'Shortage' },
    { city: 'Nagpur', 'A+': 'Adequate', 'O-': 'Adequate', 'B+': 'Low', 'AB-': 'Adequate' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Adequate':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/30';
      case 'Low':
        return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/30';
      case 'Shortage':
        return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/30';
      case 'Critical':
        return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/30';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 font-body">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
          Regional Shortage Heatmap
        </h3>
        <p className="text-[10px] text-gray-400">Inventory supply levels mapped across Maharashtra regions.</p>
      </div>

      {/* AI Prediction Warning Banner */}
      <div className="mb-6 px-4 py-2 bg-[#F77F00]/10 border border-[#F77F00]/25 rounded text-[#F77F00] text-xs font-semibold flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>AI Predictor: A+ supply level projected to reach Critical in Nashik within 5 days.</span>
      </div>

      {/* Grid Display */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border dark:border-border-dk">
              <th className="pb-3 text-xs font-bold text-gray-400 font-heading">Region</th>
              <th className="pb-3 text-xs font-bold text-gray-400 font-heading">A+</th>
              <th className="pb-3 text-xs font-bold text-gray-400 font-heading">O-</th>
              <th className="pb-3 text-xs font-bold text-gray-400 font-heading">B+</th>
              <th className="pb-3 text-xs font-bold text-gray-400 font-heading">AB-</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-border-dk/40">
            {regions.map((reg) => (
              <tr key={reg.city}>
                <td className="py-3 text-xs font-semibold text-[var(--color-text)] dark:text-white">
                  {reg.city}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${getStatusColor(reg['A+'])}`}>
                    {reg['A+']}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${getStatusColor(reg['O-'])}`}>
                    {reg['O-']}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${getStatusColor(reg['B+'])}`}>
                    {reg['B+']}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${getStatusColor(reg['AB-'])}`}>
                    {reg['AB-']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
