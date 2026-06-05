import React from 'react';
import { X, AlertCircle, PhoneCall, Mail } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import DonorAvailabilityStatus from '@/components/shared/DonorAvailabilityStatus';
import { Donor } from '@/types/donor';

interface DonorCardProps {
  donor: Donor | null;
  onClose: () => void;
}

export default function DonorCard({ donor, onClose }: DonorCardProps) {
  if (!donor) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-80 md:w-96 bg-white dark:bg-[#1E293B] border-l border-border dark:border-border-dk z-50 p-6 shadow-lift flex flex-col justify-between animate-slide-in">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#A4161A]/10 text-[#A4161A] font-heading font-bold text-sm flex items-center justify-center">
                {donor.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white">
                  {donor.name}
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">Donor ID: #{donor.id}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Special Rare Blood highlight */}
          {donor.isRareBlood && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-300 rounded flex gap-2 items-center text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Rare: {donor.rareBloodType} registry member</span>
            </div>
          )}

          {/* Profiles details */}
          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
              <span className="text-gray-400">Blood Group</span>
              <BloodGroupBadge group={donor.bloodGroup} size="sm" />
            </div>
            <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
              <span className="text-gray-400">Location City</span>
              <span className="font-semibold text-gray-700 dark:text-white">{donor.location.city}</span>
            </div>
            <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
              <span className="text-gray-400">Total Donations</span>
              <span className="font-semibold font-mono text-gray-700 dark:text-white">{donor.donationCount}</span>
            </div>
            <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
              <span className="text-gray-400">Availability status</span>
              <DonorAvailabilityStatus status={donor.availability} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-border dark:border-border-dk">
          <a
            href={`tel:${donor.phone}`}
            className="w-full py-2.5 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#660708] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call Volunteer
          </a>
          <a
            href={`mailto:${donor.email}`}
            className="w-full py-2.5 border border-border dark:border-border-dk text-[var(--color-text)] dark:text-white rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Email Donor
          </a>
        </div>
      </div>

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
    </>
  );
}
