'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';
import styles from './embed.module.css';

// Mini Inventory Bar inside the embed
interface MiniBarProps {
  bloodType: string;
  units: number;
  maxCapacity: number;
  theme: 'dark' | 'light';
}

function MiniInventoryBar({ bloodType, units, maxCapacity, theme }: MiniBarProps) {
  const percent = Math.min(Math.round((units / maxCapacity) * 100), 100);
  
  // Status colors matching DS 1.0 HSL/Hex rules
  let color = '#27AE60'; // surplus / adequate
  if (percent <= 20) {
    color = '#C41E3A'; // critical
  } else if (percent <= 40) {
    color = '#E8821A'; // low
  } else if (percent > 70) {
    color = '#2980B9'; // surplus
  }

  // Adjust text coloring for light/dark themes
  const textMutedColor = theme === 'dark' ? 'var(--ink-muted)' : '#555555';

  return (
    <div className={styles.miniBar}>
      <div className={styles.barHeader}>
        <span className={styles.barLabel}>{bloodType}</span>
        <span className={styles.barValue} style={{ color: textMutedColor }}>
          {units} / {maxCapacity} units ({percent}%)
        </span>
      </div>
      <div className={`${styles.track} ${theme === 'light' ? styles.trackLight : ''}`}>
        <div 
          className={styles.fill} 
          style={{ width: `${percent}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}

function WidgetEmbedContent() {
  const searchParams = useSearchParams();
  const hospital = searchParams.get('hospital') || 'all';
  const theme = (searchParams.get('theme') as 'dark' | 'light') || 'dark';
  const typesParam = searchParams.get('types');
  
  const rawInventory = useRealTimeInventory();

  // Filter blood types
  const filterTypes = typesParam ? typesParam.split(',') : ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Simulate offset values based on hospital selector
  const inventory = rawInventory.map(item => {
    let factor = 1.0;
    if (hospital === 'GH001') factor = 0.45;
    else if (hospital === 'AE002') factor = 0.25;
    else if (hospital === 'LH003') factor = 0.3;
    
    return {
      ...item,
      units: Math.max(2, Math.round(item.units * factor)),
      maxCapacity: Math.round(item.maxCapacity * (hospital === 'all' ? 1.0 : 0.4)),
    };
  }).filter(item => filterTypes.includes(item.bloodType));

  const isLight = theme === 'light';

  return (
    <div className={`${styles.embedContainer} ${isLight ? styles.embedContainerLight : ''}`}>
      <div className={`${styles.logoRow} ${isLight ? styles.logoRowLight : ''}`}>
        <div className={`${styles.brand} ${isLight ? styles.brandLight : ''}`}>
          {/* Small 12px Teardrop Icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C41E3A">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span>BloodBridge</span>
        </div>
        <span className={`${styles.badge} ${isLight ? styles.badgeLight : ''}`}>
          Live Stock
        </span>
      </div>

      <div className={styles.grid}>
        {inventory.map(item => (
          <MiniInventoryBar
            key={item.bloodType}
            bloodType={item.bloodType}
            units={item.units}
            maxCapacity={item.maxCapacity}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}

export default function WidgetEmbedPage() {
  return (
    <Suspense fallback={
      <div style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-ui)', padding: '20px', textAlign: 'center' }}>
        Loading Live Status...
      </div>
    }>
      <WidgetEmbedContent />
    </Suspense>
  );
}
