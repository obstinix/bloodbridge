'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import { useAlertStore } from '@/stores/alertStore';
import { BloodRequest } from '@/types/request';

// Countdown Timer Component
function CountdownTimer({ requestedAt }: { requestedAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    const targetTime = new Date(requestedAt).getTime() + 15 * 60 * 1000; // 15 mins countdown

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsLow(true);
        return;
      }

      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (mins < 5) {
        setIsLow(true);
      }

      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [requestedAt]);

  return (
    <span className={`font-mono text-xs font-bold tabular-nums ${isLow ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
      {timeLeft}
    </span>
  );
}

export default function AlertPanel() {
  const { alerts, dismissAlert } = useAlertStore();

  const handleRespond = (id: string) => {
    alert(`Thank you for responding to SOS Alert #${id}! Coordinates have been shared via SMS.`);
    dismissAlert(id);
  };

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 font-body h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
          Active SOS Dispatches
        </h3>
        {alerts.length > 0 && (
          <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse"></span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-1">
        <AnimatePresence initial={false}>
          {alerts.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center text-gray-400">
              <Clock className="w-8 h-8 opacity-40 mb-3" />
              <p className="text-xs font-semibold">No active SOS dispatches</p>
              <p className="text-[10px] text-gray-500 mt-1">Network operation is stable.</p>
            </div>
          ) : (
            alerts.map((alertItem) => (
              <motion.div
                key={alertItem.id}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="bg-[var(--color-background)] dark:bg-[#0F172A] border border-border dark:border-border-dk rounded p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <BloodGroupBadge group={alertItem.bloodGroup} size="md" />
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white truncate max-w-36">
                        {alertItem.hospital}
                      </h4>
                      <span className="text-[10px] text-gray-400">1.2km • Nasik</span>
                    </div>
                  </div>
                  <CountdownTimer requestedAt={alertItem.requestedAt} />
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500">
                  <span>Urgency: <strong className="text-[#A4161A] dark:text-red-400">{alertItem.urgency}</strong></span>
                  <span>{alertItem.units} units required</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(alertItem.id)}
                    className="flex-1 py-1.5 bg-[#A4161A] text-white text-[10px] font-semibold rounded-[6px] hover:bg-[#660708] transition-colors"
                  >
                    Respond
                  </button>
                  <button
                    onClick={() => dismissAlert(alertItem.id)}
                    className="px-2 py-1.5 border border-border dark:border-border-dk hover:bg-black/5 dark:hover:bg-white/5 text-[10px] font-semibold text-gray-400 rounded-[6px]"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
