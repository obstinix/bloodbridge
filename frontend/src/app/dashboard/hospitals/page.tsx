'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Phone, FileText, ChevronRight, X, LayoutGrid, List } from 'lucide-react';
import { Hospital } from '@/types/hospital';
import { BloodGroup } from '@/constants/bloodGroups';

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const hospitals: (Hospital & { city: string })[] = [
    {
      id: 'H01',
      name: 'City General Hospital',
      address: '22 Sion Ring Rd, Sion East',
      city: 'Mumbai',
      location: { lat: 19.0390, lng: 72.8619 },
      contact: '+91 22 9876 5432',
      activeRequests: 2,
      inventory: { 'O+': 16, 'A+': 8, 'B+': 12 },
    },
    {
      id: 'H02',
      name: 'Holy Spirit Hospital',
      address: 'Mahakali Caves Rd, Andheri East',
      city: 'Mumbai',
      location: { lat: 19.1235, lng: 72.8732 },
      contact: '+91 22 2824 8500',
      activeRequests: 1,
      inventory: { 'O-': 2, 'AB+': 4, 'B-': 1 },
    },
    {
      id: 'H03',
      name: 'KEM Hospital Nashik',
      address: 'Sardar Patel Marg, GIDC',
      city: 'Nashik',
      location: { lat: 19.9975, lng: 73.7898 },
      contact: '+91 253 111 2222',
      activeRequests: 0,
      inventory: { 'O+': 8, 'A+': 15, 'AB-': 1 },
    },
  ];

  // Filters
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'all' || h.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  return (
    <div className="space-y-6 font-body relative">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Hospital network Directory
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded border border-border dark:border-border-dk">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[4px] text-gray-500 hover:text-gray-900 ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : ''
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[4px] text-gray-500 hover:text-gray-900 ${
                viewMode === 'table' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => alert('Add hospital coordinates coordinates.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Hospital
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 border border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548] rounded-[6px] w-72 text-gray-400">
          <Search className="w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search hospitals by name, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs outline-none w-full text-[var(--color-text)] dark:text-white"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded px-3 py-1.5 outline-none text-xs text-gray-500 dark:text-gray-300 font-medium"
        >
          <option value="all">All Cities</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Nashik">Nashik</option>
        </select>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHospitals.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelectedHospital(h)}
              className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 flex flex-col justify-between hover:shadow-card hover:translate-y-[-1px] transition-all cursor-pointer shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white truncate max-w-44">
                    {h.name}
                  </h4>
                  {h.activeRequests > 0 && (
                    <span className="bg-red-50 text-red-600 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-200">
                      {h.activeRequests} SOS
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 leading-normal mb-4">
                  {h.address}, {h.city}
                </p>
              </div>

              {/* Mini Inventory Bar */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Reserves Summary</span>
                <div className="flex gap-1">
                  {(Object.keys(h.inventory) as BloodGroup[]).map((g) => (
                    <span key={g} className="text-[9px] font-mono font-bold bg-gray-50 dark:bg-slate-800 text-gray-500 border border-border dark:border-border-dk px-1.5 py-0.5 rounded">
                      {g}: {h.inventory[g]}
                    </span>
                  ))}
                  {Object.keys(h.inventory).length === 0 && (
                    <span className="text-[9px] text-gray-400">No stocks declared</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Hospital Name</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">City</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Active SOS</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Contact</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-border-dk/40 text-xs">
                {filteredHospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 font-semibold text-[var(--color-text)] dark:text-white">{h.name}</td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">{h.city}</td>
                    <td className="p-3 font-mono font-bold text-red-600">{h.activeRequests}</td>
                    <td className="p-3 font-mono text-gray-500">{h.contact}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedHospital(h)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 border border-border dark:border-border-dk text-[10px] font-semibold text-gray-500 hover:text-[#A4161A] rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out detail Drawer/Panel */}
      {selectedHospital && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setSelectedHospital(null)} />
          <div className="fixed top-0 right-0 h-screen w-80 md:w-96 bg-white dark:bg-[#1E293B] border-l border-border dark:border-border-dk z-50 p-6 shadow-lift flex flex-col justify-between animate-slide-in">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">Hospital ID: #{selectedHospital.id}</span>
                  <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white mt-1">
                    {selectedHospital.name}
                  </h3>
                </div>
                <button onClick={() => setSelectedHospital(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* hospital details */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Contact Number</span>
                  <span className="font-semibold text-gray-700 dark:text-white">{selectedHospital.contact}</span>
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Address Location</span>
                  <span className="font-semibold text-gray-700 dark:text-white truncate max-w-44">{selectedHospital.address}</span>
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Active SOS Alerts</span>
                  <span className="font-mono font-bold text-red-600">{selectedHospital.activeRequests} active</span>
                </div>

                {/* Inventory lists */}
                <div className="space-y-2">
                  <span className="text-gray-400 block font-heading font-bold uppercase tracking-wider text-[10px]">Reserves Stocks</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(selectedHospital.inventory) as BloodGroup[]).map((g) => (
                      <div key={g} className="bg-gray-50 dark:bg-slate-800 p-2 border border-border dark:border-border-dk rounded text-center">
                        <div className="text-[9px] font-bold text-gray-400">{g}</div>
                        <div className="text-sm font-bold font-mono text-gray-700 dark:text-white">{selectedHospital.inventory[g]} u</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-border dark:border-border-dk">
              <a
                href={`tel:${selectedHospital.contact}`}
                className="w-full py-2.5 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#660708] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Hospital Desk
              </a>
              <button
                onClick={() => alert(`Requesting inventory report update from ${selectedHospital.name}`)}
                className="w-full py-2.5 border border-border dark:border-border-dk text-[var(--color-text)] dark:text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> Request Stock Audit
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide-out Panel animations */}
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
