import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface DigitalDonorCardProps {
  donorId: string;
  name: string;
  bloodGroup: string;
  donationCount: number;
  streak: number;
}

export default function DigitalDonorCard({
  donorId,
  name,
  bloodGroup,
  donationCount,
  streak,
}: DigitalDonorCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const qrData = `bloodbridge://donor/${donorId}/${bloodGroup}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-[340px] h-[215px] cursor-pointer perspective-1000 relative"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full transform-style-3d relative"
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-[8px] border-l-[4px] border-l-[#A4161A] p-4 flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-heading font-bold text-xs text-[#A4161A]">BloodBridge</span>
                <span className="block text-[8px] font-mono text-gray-400">DONOR CARD</span>
              </div>
              <span className="font-display font-bold text-3xl text-[#A4161A] leading-none">
                {bloodGroup}
              </span>
            </div>
            
            <div className="text-center my-2">
              <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white truncate">
                {name}
              </h3>
              <span className="text-[9px] font-mono text-gray-400 block mt-0.5">Donor ID: {donorId}</span>
            </div>

            <div className="flex justify-between items-end">
              <div className="text-[8px] font-mono text-gray-400">
                <span>VOLUNTEER RESPONSE NETWORK</span>
              </div>
              <div className="bg-white p-1 rounded border border-border/60">
                <QRCodeSVG value={qrData} size={45} />
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden bg-[#FAFAFA] dark:bg-[#263548] border border-border dark:border-border-dk rounded-[8px] p-4 flex flex-col justify-between shadow-md rotate-y-180">
            <div>
              <span className="font-heading font-bold text-[9px] text-gray-400 uppercase tracking-wider block mb-2">
                Donation Ledger
              </span>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-[8px]">DONATIONS</span>
                  <span className="font-bold text-[var(--color-text)] dark:text-white">{donationCount} Times</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[8px]">CURRENT STREAK</span>
                  <span className="font-bold text-[var(--color-text)] dark:text-white">{streak} Months</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 dark:border-border-dk/60 pt-2 text-center text-[8px] font-mono text-gray-400">
              <p>Compatibility: Safe for O+/A+/B+/AB+</p>
              <p className="mt-1 text-[#A4161A] font-semibold">Emergency Desk: 1800-XXX-XXXX</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); alert('Donor card download triggered.'); }}
          className="px-3 py-1.5 border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded-[6px] text-[10px] font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Download PDF
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); alert('Share link generated.'); }}
          className="px-3 py-1.5 border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded-[6px] text-[10px] font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Share Profile
        </button>
      </div>
    </div>
  );
}
