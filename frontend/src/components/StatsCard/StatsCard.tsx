import React from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  value: string | number;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  status?: 'critical' | 'low' | 'adequate' | 'surplus';
  className?: string;
}

export default function StatsCard({
  value,
  label,
  delta,
  deltaPositive = true,
  icon,
  status,
  className = '',
}: StatsCardProps) {
  const cardClasses = [
    styles.card,
    status ? styles.withStatus : '',
    status ? styles[status] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
      </div>

      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {delta && (
          <span
            className={`${styles.delta} ${
              deltaPositive ? styles.positive : styles.negative
            }`}
          >
            {deltaPositive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
    </div>
  );
}
