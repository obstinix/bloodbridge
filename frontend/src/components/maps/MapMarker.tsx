import React from 'react';
import { MapPin, Cross } from 'lucide-react';
import { BloodGroup } from '@/constants/bloodGroups';

export interface MarkerData {
  id: string;
  name: string;
  type: 'bank' | 'hospital' | 'sos';
  address: string;
  phone: string;
  x: string; // SVG coordinate percent
  y: string;
  requestsCount?: number;
  inventory: Record<BloodGroup, number>;
}

interface MapMarkerProps {
  marker: MarkerData;
  onClick: () => void;
}

export default function MapMarker({ marker, onClick }: MapMarkerProps) {
  return (
    <button
      onClick={onClick}
      style={{ top: marker.y, left: marker.x }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
    >
      <div className="relative flex items-center justify-center">
        {marker.type === 'hospital' && (
          <div className="relative flex h-8 w-8 items-center justify-center">
            {/* SOS Ring */}
            {marker.requestsCount && marker.requestsCount > 0 && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
            )}
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500/20"></span>
            <div className="relative w-5 h-5 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-white">
              <Cross className="w-2.5 h-2.5 rotate-45" />
            </div>
          </div>
        )}

        {marker.type === 'bank' && (
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#A4161A]/20"></span>
            <MapPin className="relative w-5 h-5 text-[#A4161A] fill-[#A4161A]" />
          </div>
        )}

        {/* Tooltip on hover */}
        <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-black/80 text-white text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
          {marker.name}
        </div>
      </div>
    </button>
  );
}
