'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SOSSpreadAnimation() {
  const dots = [
    { id: 1, x: '25%', y: '20%', label: 'Donor A (O+)', dist: '0.8km', delay: 0.3 },
    { id: 2, x: '75%', y: '30%', label: 'Donor B (O+)', dist: '1.2km', delay: 0.6 },
    { id: 3, x: '15%', y: '65%', label: 'Donor C (O-)', dist: '1.9km', delay: 0.9 },
    { id: 4, x: '80%', y: '70%', label: 'Donor D (O+)', dist: '2.5km', delay: 1.2 },
    { id: 5, x: '55%', y: '85%', label: 'Donor E (O+)', dist: '3.1km', delay: 1.5 },
  ];

  return (
    <div className="relative w-full h-64 bg-gray-950 dark:bg-slate-900 rounded-card overflow-hidden border border-border dark:border-border-dk">
      {/* Central hospital point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
        <div className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A4161A] opacity-75"></span>
          <div className="relative rounded-full h-4 w-4 bg-[#A4161A] border-2 border-white flex items-center justify-center">
            <span className="text-[7px] text-white font-bold font-heading">H</span>
          </div>
        </div>
        <span className="text-[10px] text-white font-semibold bg-black/60 px-1.5 py-0.5 rounded mt-1">City Hospital</span>
      </div>

      {/* Ripple Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#A4161A]/20 rounded-full animate-[pulse-ring_3s_infinite_linear]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#A4161A]/10 rounded-full animate-[pulse-ring_3s_infinite_linear_1s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-[#A4161A]/5 rounded-full animate-[pulse-ring_3s_infinite_linear_2s]" />

      {/* Sequential Dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: dot.delay, duration: 0.4, type: 'spring' }}
          style={{ top: dot.y, left: dot.x }}
          className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
          </div>
          <div className="bg-black/80 border border-white/10 text-[9px] text-white px-1 py-0.5 rounded shadow mt-1 whitespace-nowrap">
            {dot.label} • {dot.dist}
          </div>
        </motion.div>
      ))}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.4);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
