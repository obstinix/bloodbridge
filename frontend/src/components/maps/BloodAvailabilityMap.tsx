'use client';

import React, { useState } from 'react';
import { Compass, X } from 'lucide-react';
import { BloodGroup } from '@/constants/bloodGroups';
import MapFilterPanel from './MapFilterPanel';
import MapMarker, { MarkerData } from './MapMarker';
import HeatmapOverlay from './HeatmapOverlay';

export default function BloodAvailabilityMap() {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'bank' | 'hospital'>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const markers: MarkerData[] = [
    {
      id: '1',
      name: 'City Red Cross Blood Bank',
      type: 'bank',
      address: '412 Main Street, Nashik',
      phone: '1800-419-3224',
      x: '35%',
      y: '40%',
      inventory: {
        'A+': 32, 'A-': 4, 'B+': 56, 'B-': 1, 'AB+': 12, 'AB-': 0, 'O+': 44, 'O-': 8
      }
    },
    {
      id: '2',
      name: 'Metro General Hospital',
      type: 'hospital',
      address: '22 Sion Ring Rd, Mumbai',
      phone: '+91 22 9876 5432',
      x: '60%',
      y: '55%',
      requestsCount: 2,
      inventory: {
        'A+': 8, 'A-': 0, 'B+': 12, 'B-': 0, 'AB+': 4, 'AB-': 0, 'O+': 16, 'O-': 2
      }
    },
    {
      id: '3',
      name: 'Sardar Vallabhbhai NGO Depot',
      type: 'bank',
      address: 'Plot 89, GIDC, Nashik',
      phone: '+91 253 111 2222',
      x: '25%',
      y: '65%',
      inventory: {
        'A+': 15, 'A-': 2, 'B+': 28, 'B-': 0, 'AB+': 8, 'AB-': 1, 'O+': 20, 'O-': 4
      }
    },
    {
      id: '4',
      name: 'Holy Spirit Hospital',
      type: 'hospital',
      address: 'Mahakali Caves Rd, Andheri East',
      phone: '+91 22 2824 8500',
      x: '75%',
      y: '25%',
      requestsCount: 1,
      inventory: {
        'A+': 4, 'A-': 1, 'B+': 8, 'B-': 0, 'AB+': 2, 'AB-': 0, 'O+': 10, 'O-': 1
      }
    },
  ];

  // Filtering markers
  const filteredMarkers = markers.filter((m) => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (filterGroup !== 'all') {
      const quantity = m.inventory[filterGroup as BloodGroup] || 0;
      if (quantity === 0) return false;
    }
    return true;
  });

  return (
    <div className="h-[75vh] border border-border dark:border-border-dk rounded-card overflow-hidden bg-[#E2DCDC] dark:bg-[#0F172A] relative flex font-body">
      {/* Map filter panel */}
      <MapFilterPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Heatmap Toggle overlay button */}
      <button
        onClick={() => setShowHeatmap(!showHeatmap)}
        className={`absolute top-4 right-16 z-10 px-3 py-1.5 border border-border dark:border-border-dk rounded-card shadow-lift text-xs font-semibold ${
          showHeatmap ? 'bg-[#A4161A] text-white' : 'bg-white dark:bg-[#1E293B] text-gray-500'
        }`}
      >
        Heatmap {showHeatmap ? 'ON' : 'OFF'}
      </button>

      {/* Map Content Canvas: Grayscale Grid style */}
      <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-[#0A0F1D] z-0">
        {/* Heatmap overlay */}
        <HeatmapOverlay active={showHeatmap} />

        {/* SVG Road Layout / Topology (Grayscale) */}
        <svg className="w-full h-full opacity-30 dark:opacity-10" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M 0,100 L 1000,150 M 200,0 L 250,600 M 0,400 L 1000,380 M 800,0 L 750,600 M 450,200 L 550,500" fill="none" stroke="currentColor" className="text-gray-400 dark:text-slate-600" strokeWidth="4" />
          <circle cx="350" cy="240" r="120" fill="none" stroke="currentColor" className="text-gray-300 dark:text-slate-700" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="650" cy="380" r="180" fill="none" stroke="currentColor" className="text-gray-300 dark:text-slate-700" strokeWidth="2" strokeDasharray="5 5" />
        </svg>

        {/* Map Center Compass Icon Overlay */}
        <div className="absolute bottom-4 right-4 z-10 p-2 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-full shadow text-gray-400">
          <Compass className="w-4 h-4 animate-spin-slow" />
        </div>

        {/* Markers */}
        {filteredMarkers.map((marker) => (
          <MapMarker
            key={marker.id}
            marker={marker}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
      </div>

      {/* Slide-Up Info Details Card */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lift p-4 z-20 animate-fade-in flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                selectedMarker.type === 'hospital' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-[#A4161A]/5 text-[#A4161A] border border-[#A4161A]/10'
              }`}>
                {selectedMarker.type === 'hospital' ? 'Hospital' : 'Blood Bank'}
              </span>
              <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white mt-1.5">
                {selectedMarker.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{selectedMarker.address}</p>
            </div>
            <button onClick={() => setSelectedMarker(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inventory status bars */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
              Stock Reserves (Units)
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(selectedMarker.inventory) as BloodGroup[]).slice(0, 4).map((g) => (
                <div key={g} className="bg-gray-50 dark:bg-slate-800 p-1.5 rounded text-center border border-border dark:border-border-dk">
                  <div className="text-[9px] font-bold font-mono text-gray-500">{g}</div>
                  <div className="text-xs font-mono font-bold text-[var(--color-text)] dark:text-white">
                    {selectedMarker.inventory[g]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <a
              href={`tel:${selectedMarker.phone}`}
              className="flex-1 text-center py-2 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px] text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Call Depot
            </a>
            <button
              onClick={() => alert(`Directions shared. Open Google Maps coordinates.`)}
              className="flex-1 py-2 bg-[#A4161A] hover:bg-[#660708] text-white text-xs font-semibold rounded-[6px] transition-colors"
            >
              Get Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
