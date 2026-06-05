'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { Donor } from '@/types/donor';
import DonorTable from '@/components/donors/DonorTable';
import DonorCard from '@/components/donors/DonorCard';
import EligibilityChecker from '@/components/donors/EligibilityChecker';

const donors: Donor[] = [
  {
    id: 'D00124',
    name: 'Arjun Mehta',
    bloodGroup: 'O+',
    phone: '+91 98234 56789',
    email: 'arjun.mehta@gmail.com',
    location: { lat: 19.9975, lng: 73.7898, city: 'Nashik' },
    lastDonated: '2026-05-01',
    nextEligible: '2026-06-26',
    donationCount: 18,
    streak: 5,
    status: 'Recently Donated',
    availability: 'Busy',
    badges: ['bronze', 'silver', 'streak7'],
    isRareBlood: false,
  },
  {
    id: 'D00125',
    name: 'Neha Patil',
    bloodGroup: 'A-',
    phone: '+91 98456 12307',
    email: 'neha.patil@rediff.com',
    location: { lat: 18.5204, lng: 73.8567, city: 'Pune' },
    lastDonated: '2026-02-14',
    nextEligible: '2026-04-11',
    donationCount: 8,
    streak: 2,
    status: 'Available',
    availability: 'Ready to Donate',
    badges: ['bronze'],
    isRareBlood: false,
  },
  {
    id: 'D00126',
    name: 'Kabir Shah',
    bloodGroup: 'AB-',
    phone: '+91 95555 44432',
    email: 'kabir.shah@yahoo.com',
    location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
    lastDonated: null,
    nextEligible: '2026-06-06',
    donationCount: 0,
    streak: 0,
    status: 'Available',
    availability: 'Available',
    badges: [],
    isRareBlood: true,
    rareBloodType: 'Bombay Blood Group',
  },
  {
    id: 'D00127',
    name: 'Priya Desai',
    bloodGroup: 'O-',
    phone: '+91 98888 77766',
    email: 'priya.desai@outlook.com',
    location: { lat: 19.9975, lng: 73.7898, city: 'Nashik' },
    lastDonated: '2025-11-20',
    nextEligible: '2026-01-15',
    donationCount: 32,
    streak: 12,
    status: 'Available',
    availability: 'Available',
    badges: ['bronze', 'silver', 'gold', 'rare'],
    isRareBlood: true,
    rareBloodType: 'Rh-null',
  },
];

export default function DonorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Filters
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup = selectedGroup === 'all' || d.bloodGroup === selectedGroup;
      const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [searchQuery, selectedGroup, selectedStatus]);

  const handleExportCSV = () => {
    const headers = 'ID,Name,Blood Group,Status,Availability,Last Donated,Streak,Phone,Email\n';
    const rows = filteredDonors
      .map(
        (d) =>
          `#${d.id},"${d.name}",${d.bloodGroup},${d.status},${d.availability},${d.lastDonated || 'Never'},${d.streak},"${d.phone}","${d.email}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BloodBridge_Donors_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 font-body relative">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Donor Network Directory
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] rounded-[6px] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => alert('Add donor registration coordinates.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Register Donor
          </button>
        </div>
      </div>

      {/* Grid layout: Left 2/3 directory, Right 1/3 eligibility checker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Filter controls */}
          <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548] rounded-[6px] w-72 text-gray-400">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search directory by name, ID, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs outline-none w-full text-[var(--color-text)] dark:text-white"
              />
            </div>

            {/* Custom selectors */}
            <div className="flex flex-wrap gap-3 text-xs">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded px-3 py-1.5 outline-none text-gray-500 dark:text-gray-300 font-medium"
              >
                <option value="all">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded px-3 py-1.5 outline-none text-gray-500 dark:text-gray-300 font-medium"
              >
                <option value="all">All Eligibility</option>
                <option value="Available">Available</option>
                <option value="Recently Donated">Recently Donated</option>
                <option value="Ineligible">Ineligible</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <DonorTable donors={filteredDonors} onSelectDonor={setSelectedDonor} />
        </div>

        {/* Right side panel - Eligibility Checker */}
        <div>
          <EligibilityChecker />
        </div>
      </div>

      {/* Slide-out detail Drawer/Panel */}
      <DonorCard donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
    </div>
  );
}
