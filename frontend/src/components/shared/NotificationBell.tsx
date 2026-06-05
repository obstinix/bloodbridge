'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(3);
  const [showDropdown, setShowDropdown] = useState(false);

  const notifications = [
    { id: '1', text: '🆘 O+ needed urgently at City Hospital', time: '5m ago', type: 'sos' },
    { id: '2', text: '📅 Whole blood donation drive on Dec 3', time: '2h ago', type: 'drive' },
    { id: '3', text: '🎉 You earned Lifesaver Bronze badge!', time: '1d ago', type: 'badge' },
  ];

  const handleOpenDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setUnreadCount(0); // clear count on open
    }
  };

  return (
    <div className="relative font-body">
      <button
        onClick={handleOpenDropdown}
        className="relative p-1.5 border border-border dark:border-border-dk bg-surface dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white rounded hover:bg-[var(--color-background)] dark:hover:bg-[#263548] transition-colors focus:outline-none"
      >
        <motion.div
          animate={unreadCount > 0 ? {
            rotate: [0, -10, 10, -10, 10, -5, 5, 0],
            transition: { repeat: Infinity, repeatDelay: 5, duration: 0.5 }
          } : {}}
        >
          <Bell className="w-4 h-4" />
        </motion.div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#A4161A] text-white text-[9px] font-mono font-bold leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E293B] rounded shadow-lift border border-border dark:border-border-dk z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-border dark:border-border-dk flex justify-between items-center bg-[#FAFAFA] dark:bg-[#263548]">
                <span className="text-xs font-semibold text-[var(--color-text)] dark:text-white font-heading">Recent Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={() => setUnreadCount(0)} className="text-[10px] text-[#A4161A] dark:text-red-400 hover:underline">
                    Clear unread
                  </button>
                )}
              </div>
              <div className="divide-y divide-border dark:divide-border-dk max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#F5F3F4] dark:hover:bg-[#263548] transition-colors flex flex-col gap-0.5">
                    <p className="text-xs text-[var(--color-text)] dark:text-[#F8FAFC]">
                      {n.text}
                    </p>
                    <span className="text-[10px] text-gray-500 font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border dark:border-border-dk text-center bg-[#FAFAFA] dark:bg-[#263548]">
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setShowDropdown(false)}
                  className="text-xs text-[#A4161A] dark:text-red-400 font-semibold hover:underline block w-full"
                >
                  View all alerts
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
