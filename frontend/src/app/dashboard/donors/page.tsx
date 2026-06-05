'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Eye, Flame, AlertCircle, X, Mail, PhoneCall } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import DonorAvailabilityStatus, { AvailabilityStatus } from '@/components/shared/DonorAvailabilityStatus';
import { Donor } from '@/types/donor';
import { formatDate } from '@/lib/utils';

export default function DonorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

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
              {filteredDonors.map((d) => (
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
                    {d.streak > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 font-mono">
                        <Flame className="w-3.5 h-3.5 fill-orange-600" /> {d.streak}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-mono">-</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedDonor(d)}
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

      {/* Slide-out detail Drawer/Panel */}
      {selectedDonor && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setSelectedDonor(null)} />
          <div className="fixed top-0 right-0 h-screen w-80 md:w-96 bg-white dark:bg-[#1E293B] border-l border-border dark:border-border-dk z-50 p-6 shadow-lift flex flex-col justify-between animate-slide-in">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#A4161A]/10 text-[#A4161A] font-heading font-bold text-sm flex items-center justify-center">
                    {selectedDonor.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white">
                      {selectedDonor.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">Donor ID: #{selectedDonor.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedDonor(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Special Rare Blood highlight */}
              {selectedDonor.isRareBlood && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-300 rounded flex gap-2 items-center text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Rare: {selectedDonor.rareBloodType} registry member</span>
                </div>
              )}

              {/* Profiles details */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Blood Group</span>
                  <BloodGroupBadge group={selectedDonor.bloodGroup} size="sm" />
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Location City</span>
                  <span className="font-semibold text-gray-700 dark:text-white">{selectedDonor.location.city}</span>
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Total Donations</span>
                  <span className="font-semibold font-mono text-gray-700 dark:text-white">{selectedDonor.donationCount}</span>
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Availability status</span>
                  <DonorAvailabilityStatus status={selectedDonor.availability} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-border dark:border-border-dk">
              <a
                href={`tel:${selectedDonor.phone}`}
                className="w-full py-2.5 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#660708] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Volunteer
              </a>
              <a
                href={`mailto:${selectedDonor.email}`}
                className="w-full py-2.5 border border-border dark:border-border-dk text-[var(--color-text)] dark:text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Email Donor
              </a>
            </div>
          </div>
        </>
      )}

      {/* Slide-in Animations styles */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
