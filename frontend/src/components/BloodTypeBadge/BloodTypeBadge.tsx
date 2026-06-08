import React from 'react';
import styles from './BloodTypeBadge.module.css';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface BloodTypeBadgeProps {
  type: BloodType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BloodTypeBadge({
  type,
  size = 'md',
  className = '',
}: BloodTypeBadgeProps) {
  let typeClass = styles.typeO;
  if (type.startsWith('A') && !type.startsWith('AB')) {
    typeClass = styles.typeA;
  } else if (type.startsWith('B')) {
    typeClass = styles.typeB;
  } else if (type.startsWith('AB')) {
    typeClass = styles.typeAB;
  }

  const isUniversal = type === 'O-';

  const classes = [
    styles.badge,
    styles[size],
    typeClass,
    isUniversal ? styles.universalDonor : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {type}
    </span>
  );
}
