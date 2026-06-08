import React from 'react';
import BloodTypeBadge, { BloodType } from '../BloodTypeBadge/BloodTypeBadge';
import Button from '../Button/Button';
import styles from './RequestCard.module.css';

interface RequestCardProps {
  id: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: 'critical' | 'urgent' | 'standard';
  hospital: string;
  location: string;
  distance: number;
  postedAt: string;
  onAccept?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export default function RequestCard({
  id,
  bloodType,
  unitsNeeded,
  urgency,
  hospital,
  location,
  distance,
  postedAt,
  onAccept,
  onViewDetails,
  className = '',
}: RequestCardProps) {
  let leftBorderClass = styles.standard;
  let pillClass = styles.urgencyPillStandard;

  if (urgency === 'critical') {
    leftBorderClass = styles.critical;
    pillClass = styles.urgencyPillCritical;
  } else if (urgency === 'urgent') {
    leftBorderClass = styles.urgent;
    pillClass = styles.urgencyPillUrgent;
  }

  return (
    <div className={`${styles.card} ${leftBorderClass} ${className}`}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <div className={styles.badgeGroup}>
          <BloodTypeBadge type={bloodType} size="md" />
          <span className={styles.unitsLabel}>{unitsNeeded} units</span>
        </div>
        <span className={`${styles.urgencyPill} ${pillClass}`}>
          {urgency}
        </span>
      </div>

      {/* Hospital details */}
      <div className={styles.middleSection}>
        <h4 className={styles.hospitalName}>{hospital}</h4>
        <div className={styles.metaLine}>
          <span>{location}</span>
          <span className={styles.bullet}>•</span>
          <span>{distance.toFixed(1)} km away</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div className={styles.bottomRow}>
        <span className={styles.postedTime}>{postedAt}</span>
        <div className={styles.actions}>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(id)}>
              Details
            </Button>
          )}
          {onAccept && (
            <Button variant="primary" size="sm" onClick={() => onAccept(id)}>
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
