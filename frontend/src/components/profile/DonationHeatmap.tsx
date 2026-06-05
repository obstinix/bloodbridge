import React from 'react';

export default function DonationHeatmap() {
  const cells = Array.from({ length: 371 }).map((_, index) => {
    const weight = index === 45 || index === 142 || index === 250 ? 'bg-[#A4161A]' : 'bg-gray-100 dark:bg-slate-800';
    return { id: index, weight };
  });

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm">
      <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
        Donation Calendar Heatmap
      </h3>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
          {cells.map((cell) => (
            <div 
              key={cell.id} 
              className={`w-2 h-2 rounded-[1px] ${cell.weight}`} 
              title="Donation log coordinates details"
            />
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-gray-400 font-mono mt-2 uppercase">
          <span>June 2025</span>
          <span>Dec 2025</span>
          <span>June 2026</span>
        </div>
      </div>
    </div>
  );
}
