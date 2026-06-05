import React from 'react';

export interface ProgressProps {
  value: number; // percentage (0-100)
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-border/40 dark:border-border-dk/40 ${className}`}>
      <div 
        className="bg-[#A4161A] dark:bg-[#DC2626] h-full transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
