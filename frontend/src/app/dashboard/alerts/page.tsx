'use client';

import React, { useState } from 'react';
import { Bell, Siren, ShieldAlert, Calendar, Heart, Trash2, CheckSquare } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { BloodGroup } from '@/constants/bloodGroups';

interface AlertLog {
  id: string;
  type: 'sos' | 'reminder' | 'system' | 'badge';
  text: string;
  time: string;
  isRead: boolean;
  group?: BloodGroup;
}

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<'all' | 'sos' | 'reminder' | 'system'>('all');
  const [logs, setLogs] = useState<AlertLog[]>([
    {
      id: '1',
      type: 'sos',
      text: '🆘 O+ Whole Blood needed urgently at Sion Hospital. Respond now.',
      time: 'Just now',
      isRead: false,
      group: 'O+',
    },
    {
      id: '2',
      type: 'reminder',
      text: '📅 Whole Blood Donation drive starting tomorrow at KTHM College Nashik.',
      time: '1h ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'badge',
      text: '🎉 Congratulations! You earned the Lifesaver Bronze achievement badge.',
      time: '1d ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'system',
      text: '⚙️ Security warning: Password updated coordinates verified.',
      time: '3d ago',
      isRead: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setLogs((prev) => prev.map((l) => ({ ...l, isRead: true })));
  };

  const handleClearAll = () => {
    setLogs([]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const filteredLogs = logs.filter((l) => filterType === 'all' || l.type === filterType);

  const getLogIcon = (type: AlertLog['type']) => {
    switch (type) {
      case 'sos':
        return <Siren className="w-4 h-4 text-[#A4161A]" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'badge':
        return <Heart className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 font-body max-w-3xl mx-auto">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Notification center
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 px-3 py-1.5 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white rounded transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" /> Mark All Read
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-1.5 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] text-xs font-semibold text-gray-500 hover:text-red-600 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 text-xs">
        {(['all', 'sos', 'reminder', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full border capitalize font-semibold transition-colors ${
              filterType === t
                ? 'bg-[#A4161A] text-white border-transparent'
                : 'border-border dark:border-border-dk text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {t === 'all' ? 'All Alerts' : t === 'sos' ? 'SOS Warnings' : t === 'reminder' ? 'Reminders' : 'System Logs'}
          </button>
        ))}
      </div>

      {/* Alert Feed log items */}
      <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm divide-y divide-border/40 dark:divide-border-dk/40">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400">
            No active notification logs found.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-4 flex gap-4 items-start justify-between hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors relative ${
                !log.isRead ? 'bg-[#A4161A]/5 dark:bg-red-950/10' : ''
              }`}
            >
              {/* Unread indicator */}
              {!log.isRead && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#A4161A]" />
              )}

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded mt-0.5">
                  {getLogIcon(log.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--color-text)] dark:text-white font-medium leading-relaxed">
                    {log.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">{log.time}</span>
                    {log.group && <BloodGroupBadge group={log.group} size="sm" />}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteLog(log.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                title="Delete alert"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
