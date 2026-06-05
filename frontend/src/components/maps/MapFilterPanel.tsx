import React from 'react';
import { X, Sliders } from 'lucide-react';
import { BloodGroup } from '@/constants/bloodGroups';

interface MapFilterPanelProps {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  filterGroup: BloodGroup | 'all';
  setFilterGroup: (val: BloodGroup | 'all') => void;
  filterType: 'all' | 'bank' | 'hospital';
  setFilterType: (val: 'all' | 'bank' | 'hospital') => void;
}

export default function MapFilterPanel({
  showFilters,
  setShowFilters,
  filterGroup,
  setFilterGroup,
  filterType,
  setFilterType,
}: MapFilterPanelProps) {
  if (!showFilters) {
    return (
      <button
        onClick={() => setShowFilters(true)}
        className="absolute top-4 left-4 z-10 p-2 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lift text-gray-500"
      >
        <Sliders className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-10 w-72 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lift p-4 flex flex-col gap-4 max-h-[calc(100%-2rem)] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-heading">
          Map Query Coordinates
        </h3>
        <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Type */}
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Location Type
        </label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-slate-800 p-0.5 rounded border border-border dark:border-border-dk">
          {(['all', 'bank', 'hospital'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`py-1 text-[9px] font-bold rounded capitalize ${
                filterType === t
                  ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {t === 'all' ? 'All' : t === 'bank' ? 'Banks' : 'Hospitals'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Blood Group */}
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Select Blood Group
        </label>
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value as any)}
          className="w-full text-xs border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded p-2 outline-none text-gray-700 dark:text-white"
        >
          <option value="all">All Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      {/* Range Distance */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mb-1">
          <span>Proximity Range</span>
          <span>25 km</span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          defaultValue="25"
          className="w-full accent-[#A4161A]"
        />
      </div>
    </div>
  );
}
