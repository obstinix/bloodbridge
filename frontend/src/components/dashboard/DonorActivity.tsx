'use client';

import React from 'react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { BloodGroup } from '@/constants/bloodGroups';

interface ActivityItem {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  location: string;
  timeAgo: string;
}

export default function DonorActivity() {
  const activities: ActivityItem[] = [
    { id: '1', name: 'Arjun Mehta', bloodGroup: 'O+', location: 'City General Hospital', timeAgo: '18m ago' },
    { id: '2', name: 'Neha Patil', bloodGroup: 'B+', location: 'Red Cross Nashik', timeAgo: '1h ago' },
    { id: '3', name: 'Kabir Shah', bloodGroup: 'AB-', location: 'Holy Spirit Hospital', timeAgo: '3h ago' },
    { id: '4', name: 'Riya Sen', bloodGroup: 'A+', location: 'Breach Candy Hospital', timeAgo: '6h ago' },
    { id: '5', name: 'Amit Roy', bloodGroup: 'O-', location: 'Fortis Hospital', timeAgo: '1d ago' },
  ];

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 font-body">
      <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-6">
        Recent Donor Activity Log
      </h3>

      <div className="relative border-l border-border dark:border-border-dk pl-6 space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="relative">
            {/* Pulsing indicator dot */}
            <span className="absolute -left-[30px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#A4161A] border-2 border-white dark:border-[#1E293B]" />
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--color-text)] dark:text-white">
                {act.name}
              </span>
              <span className="text-[10px] text-gray-400">donated</span>
              <BloodGroupBadge group={act.bloodGroup} size="sm" />
              <span className="text-[10px] text-gray-400">at</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {act.location}
              </span>
              <span className="text-[9px] font-mono text-gray-400 ml-auto">{act.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
