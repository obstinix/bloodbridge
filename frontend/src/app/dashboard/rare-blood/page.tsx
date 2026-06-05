'use client';

import React from 'react';
import { ShieldAlert, AlertCircle, Siren, BookOpen } from 'lucide-react';

export default function RareBloodRegistryPage() {
  const rareDonors = [
    {
      id: 'D00126',
      name: 'Kabir Shah',
      type: 'Bombay Blood Group (hh)',
      city: 'Mumbai',
      lastContacted: '2026-05-18',
      status: 'Ready',
    },
    {
      id: 'D00127',
      name: 'Priya Desai',
      type: 'Rh-null (Golden Blood)',
      city: 'Nashik',
      lastContacted: '2026-06-02',
      status: 'Available',
    },
    {
      id: 'D00130',
      name: 'Rohit Sen',
      type: 'Bombay Blood Group (hh)',
      city: 'Pune',
      lastContacted: '2026-04-20',
      status: 'Ready',
    },
  ];

  const handleSendPriorityAlert = (name: string, type: string) => {
    alert(`Priority SOS notification dispatched to rare donor ${name} (${type}).`);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Top Header info */}
      <div className="p-5 bg-gradient-to-r from-amber-600/10 to-red-600/10 dark:from-amber-600/5 dark:to-red-600/5 border border-amber-200 dark:border-amber-900/30 rounded-card flex gap-4 items-start shadow-sm">
        <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
            Rare Blood coordinates registry
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
            Rare blood groups have extremely limited global donor availability. This registry logs coordinate entries for Bombay Blood Group, Rh-null, and other rare types for immediate prioritization in critical shortage dispatches.
          </p>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Donor Name</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Rare Blood Type</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Region City</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Last Contacted</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Status</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-border-dk/40 text-xs">
              {rareDonors.map((d) => (
                <tr key={d.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-3 font-semibold text-[var(--color-text)] dark:text-white">{d.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 border border-amber-300 bg-amber-50 text-amber-700 font-bold rounded text-[9px] dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                      {d.type}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{d.city}</td>
                  <td className="p-3 font-mono text-gray-400">{d.lastContacted}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleSendPriorityAlert(d.name, d.type)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#A4161A] text-white hover:bg-[#660708] text-[9px] font-bold rounded transition-colors"
                    >
                      <Siren className="w-3 h-3" /> Priority Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 space-y-3">
          <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" /> What is Bombay Blood Group?
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            First discovered in Bombay (Mumbai) in 1952, individuals with this rare phenotype (hh) lack the H antigen in their red blood cells. They can only receive blood from other Bombay Blood Group individuals, making coordinates logging critical.
          </p>
        </div>

        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 space-y-3">
          <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" /> What is Rh-null (Golden Blood)?
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Rh-null blood is completely devoid of all 61 Rh antigens. It is referred to as &ldquo;Golden Blood&rdquo; because it is the universal donor for anyone with rare blood types in the Rh system, but can only be received from another Rh-null donor.
          </p>
        </div>
      </div>
    </div>
  );
}
