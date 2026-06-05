import React from 'react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';

interface HistoryRecord {
  id: string;
  date: string;
  hospital: string;
  units: number;
  bloodGroup: any;
  status: any;
}

interface DonationHistoryProps {
  records: HistoryRecord[];
}

export default function DonationHistory({ records }: DonationHistoryProps) {
  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
      <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider p-6 pb-2">
        Donation Ledger History
      </h3>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Donation Date</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Hospital Location</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Group</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Volume Units</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Status</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-border-dk/40">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                <td className="p-3 text-xs font-mono text-gray-500">{formatDate(r.date)}</td>
                <td className="p-3 text-xs font-semibold text-[var(--color-text)] dark:text-white">{r.hospital}</td>
                <td className="p-3">
                  <BloodGroupBadge group={r.bloodGroup} size="sm" />
                </td>
                <td className="p-3 font-mono text-xs text-gray-700 dark:text-white">{r.units}</td>
                <td className="p-3">
                  <StatusBadge status={r.status} size="sm" />
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => alert(`Certificate generated for donation ID: #${r.id}`)}
                    className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-slate-800 border border-border dark:border-border-dk text-[10px] font-semibold text-gray-500 hover:text-[#A4161A] rounded transition-colors"
                  >
                    Certificate
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-xs text-gray-400">
                  No donation history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
