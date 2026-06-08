'use client';

import React, { useState } from 'react';
import BloodTypeBadge, { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';
import InventoryBar from '@/components/InventoryBar/InventoryBar';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './compatibility.module.css';

const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

// Row (Outer Key) = Donor, Column (Inner Key) = Recipient
export const COMPATIBILITY_MATRIX: Record<BloodType, Record<BloodType, boolean>> = {
  'O-':  { 'O-':true,  'O+':true,  'A-':true,  'A+':true,  'B-':true,  'B+':true,  'AB-':true,  'AB+':true  },
  'O+':  { 'O-':false, 'O+':true,  'A-':false, 'A+':true,  'B-':false, 'B+':true,  'AB-':false, 'AB+':true  },
  'A-':  { 'O-':false, 'O+':false, 'A-':true,  'A+':true,  'B-':false, 'B+':false, 'AB-':true,  'AB+':true  },
  'A+':  { 'O-':false, 'O+':false, 'A-':false, 'A+':true,  'B-':false, 'B+':false, 'AB-':false, 'AB+':true  },
  'B-':  { 'O-':false, 'O+':false, 'A-':false, 'A+':false, 'B-':true,  'B+':true,  'AB-':true,  'AB+':true  },
  'B+':  { 'O-':false, 'O+':false, 'A-':false, 'A+':false, 'B-':false, 'B+':true,  'AB-':false, 'AB+':true  },
  'AB-': { 'O-':false, 'O+':false, 'A-':false, 'A+':false, 'B-':false, 'B+':false, 'AB-':true,  'AB+':true  },
  'AB+': { 'O-':false, 'O+':false, 'A-':false, 'A+':false, 'B-':false, 'B+':false, 'AB-':false, 'AB+':true  },
};

export default function CompatibilityPage() {
  const [selectedRecipient, setSelectedRecipient] = useState<BloodType>('O-');
  const [hoveredRow, setHoveredRow] = useState<BloodType | null>(null);
  const [hoveredCol, setHoveredCol] = useState<BloodType | null>(null);

  const inventory = useRealTimeInventory();
  
  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();
  const revealRef3 = useScrollReveal();

  // For Section B, get donor types that can give to selectedRecipient
  const compatibleDonors = BLOOD_TYPES.filter(donor => COMPATIBILITY_MATRIX[donor][selectedRecipient]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Blood Compatibility Reference</h1>
        <p className={styles.subtitle}>
          Interactive medical matrix detailing recipient and donor group compatibility guidelines.
        </p>
      </div>

      {/* Section A: Interactive Matrix */}
      <div ref={revealRef1 as any} className={`${styles.section} reveal`}>
        <h2 className={styles.sectionTitle}>Interactive Compatibility Matrix</h2>
        <div className={styles.matrixWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th className={styles.th} style={{ background: 'transparent' }}>
                  <div className={styles.thLabel}>Recipient \ Donor</div>
                </th>
                {BLOOD_TYPES.map(donor => {
                  const isOMinus = donor === 'O-';
                  const isABPlus = donor === 'AB+';
                  const isHovered = hoveredCol === donor;
                  
                  return (
                    <th 
                      key={`col-${donor}`} 
                      className={`${styles.th} ${isOMinus ? styles.highlightUniversalDonor : ''} ${isABPlus ? styles.highlightUniversalRecipient : ''} ${isHovered ? styles.highlightHovered : ''}`}
                      onMouseEnter={() => setHoveredCol(donor)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      <BloodTypeBadge type={donor} size="sm" />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {BLOOD_TYPES.map(recipient => {
                const isOMinusRecipient = recipient === 'O-';
                const isABPlusRecipient = recipient === 'AB+';
                const isRowHovered = hoveredRow === recipient;

                return (
                  <tr key={`row-${recipient}`}>
                    <td 
                      className={`${styles.td} ${styles.th} ${isOMinusRecipient ? styles.highlightUniversalDonor : ''} ${isABPlusRecipient ? styles.highlightUniversalRecipient : ''} ${isRowHovered ? styles.highlightHovered : ''}`}
                      onMouseEnter={() => setHoveredRow(recipient)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{ textAlign: 'left', fontWeight: 'bold' }}
                    >
                      <BloodTypeBadge type={recipient} size="sm" />
                    </td>
                    {BLOOD_TYPES.map(donor => {
                      // Row = Recipient, Column = Donor
                      const isCompatible = COMPATIBILITY_MATRIX[donor][recipient];
                      const isOMinusDonor = donor === 'O-';
                      const isABPlusRecipientCell = recipient === 'AB+';
                      
                      const cellClass = [
                        styles.td,
                        isCompatible ? styles.cellCompatible : styles.cellIncompatible,
                        isOMinusDonor ? styles.highlightUniversalDonor : '',
                        isABPlusRecipientCell ? styles.highlightUniversalRecipient : '',
                        hoveredRow === recipient || hoveredCol === donor ? styles.highlightHovered : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <td
                          key={`cell-${recipient}-${donor}`}
                          className={cellClass}
                          onMouseEnter={() => {
                            setHoveredRow(recipient);
                            setHoveredCol(donor);
                          }}
                          onMouseLeave={() => {
                            setHoveredRow(null);
                            setHoveredCol(null);
                          }}
                        >
                          {isCompatible ? '✓' : '✗'}
                          <div className={styles.cellTooltip}>
                            {recipient} recipient {isCompatible ? 'CAN' : 'CANNOT'} receive from {donor}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Find Compatible Donors helper */}
      <div ref={revealRef2 as any} className={`${styles.section} reveal`}>
        <h2 className={styles.sectionTitle}>Find Compatible Donors & Stock Level</h2>
        <div className={styles.finderCard}>
          <div className={styles.finderRow}>
            <span className={styles.finderText}>I need blood for recipient type:</span>
            <select
              className={styles.selector}
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value as BloodType)}
            >
              {BLOOD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.compatibleGrid}>
            {compatibleDonors.map(donor => {
              const invItem = inventory.find(i => i.bloodType === donor);
              return (
                <div key={`donor-card-${donor}`} className={styles.donorCard}>
                  <div className={styles.donorHeader}>
                    <span className={styles.donorName}>Donor Group</span>
                    <BloodTypeBadge type={donor} size="md" />
                  </div>
                  {invItem && (
                    <InventoryBar
                      bloodType={donor}
                      units={invItem.units}
                      maxCapacity={invItem.maxCapacity}
                      lastUpdated={invItem.lastUpdated}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section C: Extended Notes (Text only) */}
      <div ref={revealRef3 as any} className={`${styles.section} reveal`}>
        <h2 className={styles.sectionTitle}>Extended Medical Annotations</h2>
        <div className={styles.notesGrid}>
          <div className={styles.noteCard}>
            <span className={styles.noteCardTitle}>Kell Antigen System</span>
            <p className={styles.noteCardDesc}>
              The Kell antigen system is the third most potent system of red cell antigens. Kell matching is critical for patients receiving recurrent transfusions (e.g., sickle cell disease) to prevent severe alloimmunization.
            </p>
          </div>

          <div className={styles.noteCard} style={{ borderLeftColor: 'var(--crimson)' }}>
            <span className={styles.noteCardTitle}>Rh Phenotype Matching</span>
            <p className={styles.noteCardDesc}>
              Beyond RhD (+/-), patients can form antibodies against other Rh antigens (C, c, E, e). Precise phenotype matching reduces the risk of delayed hemolytic transfusion reactions in chronically transfused patients.
            </p>
          </div>

          <div className={styles.noteCard} style={{ borderLeftColor: 'var(--status-adequate)' }}>
            <span className={styles.noteCardTitle}>Extended Antigen Profiles</span>
            <p className={styles.noteCardDesc}>
              Extended typing (Duffy, Kidd, MNS systems) is performed using molecular methods for transfusion-dependent conditions. This guarantees long-term immunological compatibility and prevents life-threatening complications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
