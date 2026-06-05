'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Users, Award } from 'lucide-react';
import { BloodDrive } from '@/types/drive';
import DriveCard from '@/components/drives/DriveCard';
import DriveForm from '@/components/drives/DriveForm';
import QRCheckIn from '@/components/drives/QRCheckIn';
import { Dialog } from '@/components/ui/dialog';

export default function DrivesPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<BloodDrive | null>(null);

  const [drives, setDrives] = useState<BloodDrive[]>([
    {
      id: 'D01',
      title: 'Nashik Corporate Donation Camp',
      organizer: 'Red Cross Maharashtra',
      date: '2026-06-15',
      location: 'Infosys Campus, Nashik',
      expectedDonors: 120,
      registeredCount: 42,
      status: 'Open',
    },
    {
      id: 'D02',
      title: 'College Blood Donation Drive',
      organizer: 'NSS Unit, KTHM College',
      date: '2026-06-20',
      location: 'Gymkhana Hall, Nashik',
      expectedDonors: 300,
      registeredCount: 184,
      status: 'Open',
    },
    {
      id: 'D03',
      title: 'Mumbai Central Railway Drive',
      organizer: 'Wadia Hospital Blood Bank',
      date: '2026-05-10',
      location: 'Platform 1, Mumbai Central',
      expectedDonors: 150,
      registeredCount: 142,
      status: 'Completed',
    },
  ]);

  const handleCreateDrive = (formData: Omit<BloodDrive, 'id' | 'registeredCount' | 'status'>) => {
    const driveItem: BloodDrive = {
      id: `D${Date.now().toString().slice(-2)}`,
      ...formData,
      registeredCount: 0,
      status: 'Open',
    };
    setDrives((prev) => [driveItem, ...prev]);
    setShowAddForm(false);
  };

  const filteredDrives = drives.filter((d) => 
    activeTab === 'upcoming' ? d.status !== 'Completed' : d.status === 'Completed'
  );

  return (
    <div className="space-y-6 font-body relative">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Donation Drives Coordinator
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Drive
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 shadow-sm">
        <div className="text-center md:text-left md:border-r border-border dark:border-border-dk p-2 flex items-center gap-3 justify-center md:justify-start">
          <Calendar className="w-6 h-6 text-gray-400" />
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Scheduled CampEvents</span>
            <span className="font-mono text-xl font-bold text-[var(--color-text)] dark:text-white">2 Active</span>
          </div>
        </div>
        <div className="text-center md:text-left md:border-r border-border dark:border-border-dk p-2 flex items-center gap-3 justify-center md:justify-start">
          <Users className="w-6 h-6 text-gray-400" />
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Expected Donors Onboard</span>
            <span className="font-mono text-xl font-bold text-gray-700 dark:text-white">420 Volunteers</span>
          </div>
        </div>
        <div className="text-center md:text-left p-2 flex items-center gap-3 justify-center md:justify-start">
          <Award className="w-6 h-6 text-gray-400" />
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Units Gathered Historically</span>
            <span className="font-mono text-xl font-bold text-emerald-600">142 Packets</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2/3 Content, Right 1/3 QR Check-In */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs list */}
          <div className="flex border-b border-border dark:border-border-dk">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-all ${
                activeTab === 'upcoming'
                  ? 'border-[#A4161A] text-[#A4161A] dark:text-red-400'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Upcoming Camps
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-all ${
                activeTab === 'past'
                  ? 'border-[#A4161A] text-[#A4161A] dark:text-red-400'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Past drive history
            </button>
          </div>

          {/* Drives Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDrives.map((d) => (
              <DriveCard 
                key={d.id} 
                drive={d} 
                onSelect={(selected) => setSelectedDrive(selected)} 
              />
            ))}
          </div>
        </div>

        {/* QR Check-In panel */}
        <div>
          <QRCheckIn />
        </div>
      </div>

      {/* Add Drive Form Modal */}
      <Dialog 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)}
        title="Schedule Donation Drive"
      >
        <DriveForm 
          onSubmit={handleCreateDrive} 
          onCancel={() => setShowAddForm(false)} 
        />
      </Dialog>
    </div>
  );
}
