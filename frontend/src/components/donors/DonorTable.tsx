import React from 'react';
import { Eye } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import DonorAvailabilityStatus from '@/components/shared/DonorAvailabilityStatus';
import StreakDisplay from './StreakDisplay';
import { Donor } from '@/types/donor';
import { formatDate } from '@/lib/utils';

interface DonorTableProps {
  donors: Donor[];
  onSelectDonor: (donor: Donor) => void;
}

export default function DonorTable({ donors, onSelectDonor }: DonorTableProps) {
  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Donor Name</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Blood Group</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Last Donated</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Next Eligible</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Availability</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading">Streak</th>
              <th className="p-3 text-xs font-bold text-gray-400 font-heading text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-border-dk/40">
            {donors.map((d) => (
              <tr key={d.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A4161A]/10 text-[#A4161A] font-heading font-bold text-xs flex items-center justify-center">
                    {d.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--color-text)] dark:text-white">{d.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">#{d.id} • {d.location.city}</span>
                  </div>
                </td>
                <td className="p-3">
                  <BloodGroupBadge group={d.bloodGroup} size="sm" />
                </td>
                <td className="p-3 text-xs text-gray-500 font-mono">
                  {d.lastDonated ? formatDate(d.lastDonated) : 'Never'}
                </td>
                <td className="p-3 text-xs text-gray-500 font-mono">
                  {formatDate(d.nextEligible)}
                </td>
                <td className="p-3">
                  <DonorAvailabilityStatus status={d.availability} />
                </td>
                <td className="p-3">
                  <StreakDisplay count={d.streak} />
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onSelectDonor(d)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 border border-border dark:border-border-dk text-[10px] font-semibold text-gray-500 hover:text-[#A4161A] rounded transition-colors"
                  >
                    <Eye className="w-3 h-3" /> Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
