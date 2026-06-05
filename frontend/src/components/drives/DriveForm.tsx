import React, { useState } from 'react';
import { BloodDrive } from '@/types/drive';

interface DriveFormProps {
  onSubmit: (drive: Omit<BloodDrive, 'id' | 'registeredCount' | 'status'>) => void;
  onCancel: () => void;
}

export default function DriveForm({ onSubmit, onCancel }: DriveFormProps) {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [expectedDonors, setExpectedDonors] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organizer || !date || !location || !expectedDonors) {
      alert('All fields are required.');
      return;
    }

    onSubmit({
      title,
      organizer,
      date,
      location,
      expectedDonors: Number(expectedDonors),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Drive Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Annual College Donation Drive"
          className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Organizing Entity
        </label>
        <input
          type="text"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          placeholder="e.g. Red Cross Nashik"
          className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Expected Donors Count
          </label>
          <input
            type="number"
            value={expectedDonors}
            onChange={(e) => setExpectedDonors(e.target.value ? Number(e.target.value) : '')}
            placeholder="e.g. 150"
            className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Venue Location Address
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. K.K. Wagh Engineering College Campus"
          className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-[#A4161A] text-white text-xs font-semibold rounded-[6px] hover:bg-[#660708] transition-colors"
        >
          Schedule Drive
        </button>
      </div>
    </form>
  );
}
