'use client';

import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Users, Award, CheckCircle, Clock } from 'lucide-react';

export default function DrivesPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showAddForm, setShowAddForm] = useState(false);

  const [drives, setDrives] = useState([
    {
      id: 'D01',
      title: 'Nashik Corporate Donation Camp',
      organizer: 'Red Cross Maharashtra',
      date: '2026-06-15',
      time: '09:00 AM - 04:00 PM',
      location: 'Infosys Campus, Nashik',
      expectedDonors: 120,
      status: 'Open',
      isUpcoming: true,
    },
    {
      id: 'D02',
      title: 'College Blood Donation Drive',
      organizer: 'NSS Unit, KTHM College',
      date: '2026-06-20',
      time: '10:00 AM - 05:00 PM',
      location: 'Gymkhana Hall, Nashik',
      expectedDonors: 300,
      status: 'Open',
      isUpcoming: true,
    },
    {
      id: 'D03',
      title: 'Mumbai Central Railway Drive',
      organizer: 'Wadia Hospital Blood Bank',
      date: '2026-05-10',
      time: '08:00 AM - 02:00 PM',
      location: 'Platform 1, Mumbai Central',
      expectedDonors: 150,
      collectedUnits: 142,
      status: 'Completed',
      isUpcoming: false,
    },
  ]);

  const [newDrive, setNewDrive] = useState({
    title: '',
    organizer: '',
    date: '',
    time: '09:00 AM - 05:00 PM',
    location: '',
    expectedDonors: '',
  });

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    const driveItem = {
      id: `D${Date.now().toString().slice(-2)}`,
      title: newDrive.title,
      organizer: newDrive.organizer,
      date: newDrive.date,
      time: newDrive.time,
      location: newDrive.location,
      expectedDonors: parseInt(newDrive.expectedDonors) || 50,
      status: 'Open',
      isUpcoming: true,
    };
    setDrives((prev) => [driveItem, ...prev]);
    setShowAddForm(false);
    setNewDrive({
      title: '',
      organizer: '',
      date: '',
      time: '09:00 AM - 05:00 PM',
      location: '',
      expectedDonors: '',
    });
  };

  const filteredDrives = drives.filter((d) => (activeTab === 'upcoming' ? d.isUpcoming : !d.isUpcoming));

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

      {/* Camps Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((d) => (
          <div
            key={d.id}
            className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 flex flex-col justify-between hover:shadow-card transition-shadow shadow-sm"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-mono text-gray-400 font-bold">Drive ID: #{d.id}</span>
                <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-bold uppercase ${
                  d.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {d.status}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white leading-snug mb-1">
                {d.title}
              </h3>
              <p className="text-[10px] text-gray-400 mb-4">Organized by {d.organizer}</p>

              {/* Details items */}
              <div className="space-y-2 text-xs border-t border-border/40 dark:border-border-dk/40 pt-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{d.date} • {d.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{d.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {d.isUpcoming ? `Expected Attendance: ${d.expectedDonors}` : `Collected Units: ${d.collectedUnits}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {d.isUpcoming ? (
                <button
                  onClick={() => alert(`Registered for ${d.title}. Thank you!`)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px] text-gray-600 dark:text-white transition-colors"
                >
                  Register Attendees
                </button>
              ) : (
                <div className="flex gap-2 text-[10px] items-center text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 p-2 rounded justify-center">
                  <CheckCircle className="w-3.5 h-3.5" /> Completed & Cataloged
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Drive Form Dialog overlay */}
      {showAddForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowAddForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lift p-6 w-full max-w-sm z-50 animate-fade-in space-y-4">
            <h3 className="font-heading font-semibold text-base text-[var(--color-text)] dark:text-white">
              Schedule Blood Donation Drive
            </h3>

            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Drive Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Blood Drive"
                  value={newDrive.title}
                  onChange={(e) => setNewDrive((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Organizer Org *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Cross Society"
                  value={newDrive.organizer}
                  onChange={(e) => setNewDrive((prev) => ({ ...prev, organizer: e.target.value }))}
                  className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDrive.date}
                    onChange={(e) => setNewDrive((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded p-2 outline-none text-xs text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Expected Donors
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={newDrive.expectedDonors}
                    onChange={(e) => setNewDrive((prev) => ({ ...prev, expectedDonors: e.target.value }))}
                    className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Location Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hall Auditorium, Nashik"
                  value={newDrive.location}
                  onChange={(e) => setNewDrive((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-border dark:border-border-dk bg-transparent rounded p-2 outline-none text-xs text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708]"
                >
                  Schedule Camp
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
