'use client';

import React, { useState } from 'react';
import { ShieldAlert, Plus, Download, Calendar, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { BloodGroup } from '@/constants/bloodGroups';

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  // States
  const [stock, setStock] = useState([
    { group: 'A+' as BloodGroup, units: 32, status: 'Adequate', trend: 'up' },
    { group: 'A-' as BloodGroup, units: 4, status: 'Critical', trend: 'down' },
    { group: 'B+' as BloodGroup, units: 56, status: 'Surplus', trend: 'up' },
    { group: 'B-' as BloodGroup, units: 2, status: 'Critical', trend: 'down' },
    { group: 'AB+' as BloodGroup, units: 18, status: 'Adequate', trend: 'neutral' },
    { group: 'AB-' as BloodGroup, units: 1, status: 'Critical', trend: 'down' },
    { group: 'O+' as BloodGroup, units: 44, status: 'Adequate', trend: 'up' },
    { group: 'O-' as BloodGroup, units: 8, status: 'Low', trend: 'down' },
  ]);

  const [logs, setLogs] = useState([
    { id: 'L001', type: 'addition', group: 'O+', units: 4, source: 'Nashik Drive', date: '2026-06-05 14:20' },
    { id: 'L002', type: 'dispatch', group: 'A-', units: 2, source: 'Sion Hospital', date: '2026-06-05 11:05' },
    { id: 'L003', type: 'addition', group: 'B+', units: 8, source: 'Pune Camp', date: '2026-06-04 17:30' },
  ]);

  // Add stock handler
  const [addForm, setAddForm] = useState({ group: 'O+' as BloodGroup, units: 2, source: 'Volunteer Direct' });

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    setStock((prev) =>
      prev.map((s) =>
        s.group === addForm.group
          ? { ...s, units: s.units + addForm.units, status: s.units + addForm.units > 20 ? 'Adequate' : 'Low' }
          : s
      )
    );
    setLogs((prev) => [
      {
        id: `L${Date.now().toString().slice(-3)}`,
        type: 'addition',
        group: addForm.group,
        units: addForm.units,
        source: addForm.source,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      ...prev,
    ]);
    setShowAddModal(false);
  };

  const criticalShortages = stock.filter((s) => s.units < 5);

  return (
    <div className="space-y-6 font-body relative">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Blood Bank Reserve Inventory
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting PDF stock audit report.')}
            className="flex items-center gap-1.5 px-3 py-2 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] rounded-[6px] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PDF Report
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Stock
          </button>
        </div>
      </div>

      {/* Critical Shortage Alert Banner */}
      {criticalShortages.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-card flex gap-3 items-center">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-pulse text-red-600" />
          <div className="text-xs font-medium">
            <strong>CRITICAL SUPPLY ALERT:</strong> The following blood groups have depleted below safety thresholds (&lt; 5 units):{' '}
            {criticalShortages.map((s) => s.group).join(', ')}. Priority matches enabled.
          </div>
        </div>
      )}

      {/* Grid of 8 Blood Groups cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stock.map((s) => (
          <div key={s.group} className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 flex flex-col justify-between hover:shadow-card transition-shadow duration-150">
            <div className="flex justify-between items-start">
              <BloodGroupBadge group={s.group} size="sm" />
              {s.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : s.trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4 text-[#A4161A]" />
              ) : (
                <span className="text-[10px] text-gray-400 font-bold">-</span>
              )}
            </div>
            <div className="mt-3 flex justify-between items-baseline">
              <span className="font-mono text-2xl font-bold text-[var(--color-text)] dark:text-white">
                {s.units} <span className="text-xs font-normal text-gray-400">units</span>
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                s.status === 'Critical'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : s.status === 'Low'
                  ? 'bg-amber-50 text-amber-500 border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* History Log Section */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" /> Inventory Transaction Ledger
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Ref ID</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Action</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Blood Group</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Units</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Source/Target</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-border-dk/40 text-xs">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-3 font-mono text-gray-400">#{l.id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.type === 'addition'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {l.type === 'addition' ? 'Add Stock' : 'Dispatch'}
                    </span>
                  </td>
                  <td className="p-3">
                    <BloodGroupBadge group={l.group} size="sm" />
                  </td>
                  <td className="p-3 font-mono font-bold text-gray-700 dark:text-white">{l.units}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400 font-medium">{l.source}</td>
                  <td className="p-3 font-mono text-gray-400">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lift p-6 w-full max-w-sm z-50 animate-fade-in space-y-4">
            <h3 className="font-heading font-semibold text-base text-[var(--color-text)] dark:text-white">
              Add Stock Inventory
            </h3>

            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Blood Group
                </label>
                <select
                  value={addForm.group}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, group: e.target.value as BloodGroup }))}
                  className="w-full border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded p-2 outline-none text-xs"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Units (Packets)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={addForm.units}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, units: parseInt(e.target.value) }))}
                  className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Source Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volunteer Direct, Camp name"
                  value={addForm.source}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, source: e.target.value }))}
                  className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708]"
                >
                  Confirm Addition
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
