'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Droplet, Award, Flame, Calendar, Activity, Download, Share2 } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { BloodGroup } from '@/constants/bloodGroups';
import { BADGE_DEFINITIONS } from '@/constants/badges';

export default function ProfilePage() {
  const [name, setName] = useState('Volunteer Donor');
  const [role, setRole] = useState('donor');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [donorId, setDonorId] = useState('D00124');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem('bb_name') || 'Arjun Mehta');
    setRole(localStorage.getItem('bb_role') || 'donor');
    setBloodGroup((localStorage.getItem('bb_blood_group') as BloodGroup) || 'O+');
    setDonorId(localStorage.getItem('bb_donor_id') || '000124');
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile URL copied to clipboard!');
  };

  const formattedId = String(donorId).padStart(6, '0');
  const qrData = `bloodbridge://donor/${donorId}/${bloodGroup}`;

  return (
    <div className="space-y-8 font-body pb-12 max-w-4xl mx-auto">
      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Total Donations
          </span>
          <span className="font-mono text-2xl font-bold text-[#A4161A] dark:text-red-400">18</span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Lives Saved Est.
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-600">54</span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Active Streak
          </span>
          <span className="font-mono text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-orange-600" /> 5
          </span>
        </div>
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-heading block">
            Next Eligibility
          </span>
          <span className="font-mono text-xs font-bold text-gray-700 dark:text-white mt-1.5 block">
            Jun 26, 2026
          </span>
        </div>
      </div>

      {/* Digital Donor Card flip card section */}
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-80 h-48 cursor-pointer [perspective:1000px] font-body"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative [transform-style:preserve-3d]"
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 w-full h-full bg-white dark:bg-[#1E293B] border-2 border-border dark:border-border-dk border-l-[6px] border-l-[#A4161A] rounded-card p-5 [backface-visibility:hidden] flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-5 h-5 text-[#A4161A] fill-[#A4161A]" />
                  <span className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white">
                    BloodBridge
                  </span>
                </div>
                <span className="font-display font-bold text-3xl text-[#A4161A] dark:text-red-400 leading-none">
                  {bloodGroup}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white">
                  {name}
                </h4>
                <p className="text-[9px] font-mono text-gray-400">ID: #{formattedId} • Donor</p>
              </div>

              <div className="absolute bottom-5 right-5 p-1 bg-white rounded border border-border">
                <QRCodeSVG value={qrData} size={48} />
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 w-full h-full bg-slate-900 text-white border border-border-dk rounded-card p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-md">
              <div>
                <h4 className="font-heading font-semibold text-xs text-gray-400 uppercase tracking-wider">
                  Donation Compatibility
                </h4>
                <p className="text-[10px] text-white/80 mt-1">
                  Compatible recipients: {bloodGroup === 'O+' ? 'O+, A+, B+, AB+' : 'All blood groups'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-white/60">In case of emergency contact Coordinates Hotline:</p>
                <p className="text-xs font-mono font-bold text-[#F87171]">1800-419-3224</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={() => alert('Downloading PDF card format.')}
            className="flex items-center gap-1.5 px-3 py-2 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Card
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white rounded transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Profile
          </button>
        </div>
      </div>

      {/* GitHub style calendar heatmap */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
          Donation Activity Calendar
        </h3>
        {/* Simple CSS Grid showing heatmap boxes */}
        <div className="grid grid-cols-12 gap-1 pb-2">
          {Array.from({ length: 24 }).map((_, idx) => {
            const hasDonated = idx === 4 || idx === 11 || idx === 18;
            return (
              <div
                key={idx}
                className={`h-8 rounded border ${
                  hasDonated
                    ? 'bg-[#A4161A] border-transparent'
                    : 'bg-gray-100 dark:bg-slate-800 border-border dark:border-border-dk'
                }`}
                title={hasDonated ? 'DonatedWhole Blood' : 'No donations log'}
              />
            );
          })}
        </div>
        <span className="text-[9px] text-gray-400 font-medium block mt-2">
          Logs represent consecutive 12 months calendar blocks activity.
        </span>
      </div>

      {/* Achievements Badges Grid */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 space-y-4">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-gray-400" /> Earned Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = badge.id === 'bronze' || badge.id === 'silver' || badge.id === 'streak7';
            return (
              <div
                key={badge.id}
                className={`p-4 border rounded text-center space-y-2 relative transition-all ${
                  isUnlocked
                    ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-200 dark:border-emerald-900/30'
                    : 'bg-gray-50/50 dark:bg-slate-800/10 border-border dark:border-border-dk opacity-40'
                }`}
              >
                <span className="text-2xl block">{badge.icon}</span>
                <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white truncate">{badge.name}</h4>
                <span className="text-[9px] text-gray-400 block capitalize">{badge.tier} Tier</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
