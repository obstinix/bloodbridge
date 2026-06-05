import React from 'react';

interface HeatmapOverlayProps {
  active: boolean;
}

export default function HeatmapOverlay({ active }: HeatmapOverlayProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Nashik Shortage Spot */}
      <div 
        className="absolute w-40 h-40 rounded-full bg-red-500/20 blur-2xl animate-pulse"
        style={{ top: '35%', left: '30%' }}
      />
      {/* Mumbai Shortage Spot */}
      <div 
        className="absolute w-56 h-56 rounded-full bg-orange-500/15 blur-3xl animate-pulse"
        style={{ top: '55%', left: '55%' }}
      />
    </div>
  );
}
