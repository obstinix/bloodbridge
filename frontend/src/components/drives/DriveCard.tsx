import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { BloodDrive } from '@/types/drive';
import { formatDate } from '@/lib/utils';

interface DriveCardProps {
  drive: BloodDrive;
  onSelect: (drive: BloodDrive) => void;
}

export default function DriveCard({ drive, onSelect }: DriveCardProps) {
  return (
    <div 
      onClick={() => onSelect(drive)}
      className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm hover:translate-y-[-1px] hover:shadow-card transition-all cursor-pointer flex flex-col justify-between h-48"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
            drive.status === 'Open' 
              ? 'bg-red-50 text-[#A4161A] border border-red-100' 
              : drive.status === 'Closed'
              ? 'bg-gray-100 text-gray-500'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>
            {drive.status}
          </span>
          <span className="text-[9px] font-mono text-gray-400">#{drive.id}</span>
        </div>
        <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white truncate">
          {drive.title}
        </h4>
        <p className="text-[10px] text-gray-400 mt-1">{drive.organizer}</p>
      </div>

      <div className="space-y-2 text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(drive.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{drive.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{drive.registeredCount} / {drive.expectedDonors} expected donors</span>
        </div>
      </div>
    </div>
  );
}
