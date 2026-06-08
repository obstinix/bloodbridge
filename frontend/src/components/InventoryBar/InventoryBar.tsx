import React from 'react';
import BloodTypeBadge, { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import styles from './InventoryBar.module.css';

interface InventoryBarProps {
  bloodType: BloodType;
  units: number;
  maxCapacity: number;
  lastUpdated?: string;
  className?: string;
}

export default function InventoryBar({
  bloodType,
  units,
  maxCapacity,
  lastUpdated = '2 min ago',
  className = '',
}: InventoryBarProps) {
  const percent = Math.min(Math.round((units / maxCapacity) * 100), 100);

  let statusClass = styles.adequate;
  if (percent <= 20) {
    statusClass = styles.critical;
  } else if (percent <= 40) {
    statusClass = styles.low;
  } else if (percent > 70) {
    statusClass = styles.surplus;
  }

  const fillStyle = {
    '--target-width': `${percent}%`,
    width: `${percent}%`,
  } as React.CSSProperties;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <BloodTypeBadge type={bloodType} size="md" />
        <span className={styles.units}>{units} units</span>
      </div>

      <div className={styles.track}>
        <div
          className={`${styles.fill} ${statusClass}`}
          style={fillStyle}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.percentage}>{percent}% Capacity</span>
        <span className={styles.timestamp}>{lastUpdated}</span>
      </div>
    </div>
  );
}
