'use client';

import React, { useState } from 'react';
import { Trophy, Star, ShieldAlert, Award } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { BloodGroup } from '@/constants/bloodGroups';

export default function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState<'month' | 'all'>('month');

  const podium = [
    { rank: 2, name: 'Neha Patil', count: 28, group: 'A+' as BloodGroup, badge: '🥈' },
    { rank: 1, name: 'Arjun Mehta', count: 47, group: 'O+' as BloodGroup, badge: '👑' },
    { rank: 3, name: 'Priya Desai', count: 22, group: 'O-' as BloodGroup, badge: '🥉' },
  ];

  const board = [
    { rank: 4, name: 'Amit Roy', group: 'B+' as BloodGroup, count: 18, streak: 4, city: 'Nashik' },
    { rank: 5, name: 'Kabir Shah', group: 'AB-' as BloodGroup, count: 15, streak: 0, city: 'Mumbai' },
    { rank: 6, name: 'Riya Sen', group: 'A+' as BloodGroup, count: 12, streak: 2, city: 'Pune' },
    { rank: 7, name: 'Karan Malhotra', group: 'O+' as BloodGroup, count: 10, streak: 1, city: 'Mumbai' },
  ];

  return (
    <div className="space-y-6 font-body pb-20 relative">
      {/* Top action header */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Community Champions
        </h2>
        {/* Toggle */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded border border-border dark:border-border-dk">
          <button
            onClick={() => setTimePeriod('month')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold ${
              timePeriod === 'month' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimePeriod('all')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold ${
              timePeriod === 'all' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">
        {/* Rank 2 (Left) */}
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center h-40 flex flex-col justify-between shadow-sm relative">
          <span className="text-xl absolute -top-4 left-1/2 -translate-x-1/2">{podium[0].badge}</span>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white truncate">{podium[0].name}</h4>
            <span className="text-[9px] text-gray-400">Rank #2</span>
          </div>
          <div className="font-mono text-base font-bold text-gray-700 dark:text-white">
            {podium[0].count} <span className="text-[9px] font-normal">units</span>
          </div>
        </div>

        {/* Rank 1 (Center - lifted) */}
        <div className="bg-surface dark:bg-[#1E293B] border-2 border-amber-400 rounded-card p-4 text-center h-48 flex flex-col justify-between shadow-lift relative">
          <span className="text-2xl absolute -top-5 left-1/2 -translate-x-1/2">{podium[1].badge}</span>
          <div className="mt-2">
            <h4 className="text-sm font-bold text-[var(--color-text)] dark:text-white truncate">{podium[1].name}</h4>
            <span className="text-[9px] text-[#A4161A] font-bold">Network Champion</span>
          </div>
          <div className="font-mono text-lg font-bold text-[#A4161A]">
            {podium[1].count} <span className="text-[9px] font-normal">units</span>
          </div>
        </div>

        {/* Rank 3 (Right) */}
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-4 text-center h-36 flex flex-col justify-between shadow-sm relative">
          <span className="text-xl absolute -top-4 left-1/2 -translate-x-1/2">{podium[2].badge}</span>
          <div className="mt-2">
            <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white truncate">{podium[2].name}</h4>
            <span className="text-[9px] text-gray-400">Rank #3</span>
          </div>
          <div className="font-mono text-base font-bold text-gray-700 dark:text-white">
            {podium[2].count} <span className="text-[9px] font-normal">units</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Rank</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Donor Name</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Blood Group</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Total Donations</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Streak</th>
                <th className="p-3 text-xs font-bold text-gray-400 font-heading">Region City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 dark:divide-border-dk/40 text-xs">
              {board.map((d) => (
                <tr key={d.rank} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-3 font-mono font-bold text-gray-500">#{d.rank}</td>
                  <td className="p-3 font-semibold text-[var(--color-text)] dark:text-white">{d.name}</td>
                  <td className="p-3">
                    <BloodGroupBadge group={d.group} size="sm" />
                  </td>
                  <td className="p-3 font-mono font-bold text-gray-700 dark:text-white">{d.count} units</td>
                  <td className="p-3 font-mono text-orange-600 font-bold">{d.streak > 0 ? `🔥 ${d.streak}` : '-'}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{d.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community Challenge card */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="space-y-1">
          <h4 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Active City Challenge
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal max-w-md">
            Nashik regional drives campaign: Onboard 500 active whole blood donations this month. Unlock exclusive Lifesaver Champion achievements!
          </p>
        </div>
        <div className="w-full md:w-60 space-y-1.5">
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
            <span>Progress</span>
            <span>342 / 500 units</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: '68.4%' }}></div>
          </div>
        </div>
      </div>

      {/* Sticky current user's rank card (bottom) */}
      <div className="fixed bottom-0 left-16 right-0 md:left-60 bg-surface dark:bg-[#1E293B] border-t border-border dark:border-border-dk px-6 py-4 flex justify-between items-center z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
            #47
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            You are ranked <strong className="text-[var(--color-text)] dark:text-white">#47</strong>. Reach top 25 to unlock Gold Elite status badge!
          </span>
        </div>
        <div className="w-48 hidden md:block">
          <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
