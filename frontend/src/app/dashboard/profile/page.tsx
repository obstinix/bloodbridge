'use client';

import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { BloodGroup } from '@/constants/bloodGroups';
import DigitalDonorCard from '@/components/profile/DigitalDonorCard';
import DonationHeatmap from '@/components/profile/DonationHeatmap';
import BadgeGrid from '@/components/profile/BadgeGrid';
import DonationHistory from '@/components/profile/DonationHistory';

export default function ProfilePage() {
  const [name, setName] = useState('Arjun Mehta');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [donorId, setDonorId] = useState('D00124');

  useEffect(() => {
    setName(localStorage.getItem('bb_name') || 'Arjun Mehta');
    setBloodGroup((localStorage.getItem('bb_blood_group') as BloodGroup) || 'O+');
    setDonorId(localStorage.getItem('bb_donor_id') || '000124');
  }, []);

  const historyRecords = [
    {
      id: 'DH01',
      date: '2026-05-01',
      hospital: 'Sion Hospital, Mumbai',
      units: 1,
      bloodGroup: 'O+',
      status: 'Fulfilled' as const,
    },
    {
      id: 'DH02',
      date: '2026-02-10',
      hospital: 'Metro General Hospital, Nashik',
      units: 1,
      bloodGroup: 'O+',
      status: 'Fulfilled' as const,
    },
  ];

  return (
    <div className="space-y-8 font-body pb-12 max-w-4xl mx-auto">
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Total Donations
          </span>
          <span className="font-mono text-2xl font-bold text-[#A4161A] dark:text-red-400">18</span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Lives Saved Est.
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-600">54</span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Active Streak
          </span>
          <span className="font-mono text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-orange-600" /> 5
          </span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Next Eligibility
          </span>
          <span className="font-mono text-xs font-bold text-gray-700 dark:text-white mt-1.5 block">
            Jun 26, 2026
          </span>
        </div>
      </div>

      {/* Digital Donor Card flip card section */}
      <DigitalDonorCard 
        donorId={donorId}
        name={name}
        bloodGroup={bloodGroup}
        donationCount={18}
        streak={5}
      />

      {/* GitHub style calendar heatmap */}
      <DonationHeatmap />

      {/* Achievements Badges Grid */}
      <BadgeGrid unlockedBadges={['bronze', 'silver', 'streak7']} />

      {/* Donation History List */}
      <DonationHistory records={historyRecords} />
    </div>
  );
}
