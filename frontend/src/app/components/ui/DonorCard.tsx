import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

type DonorCardProps = {
  donorId: number;
  donorName: string;
  bloodGroup: string;
  contact: string;
};

export default function DonorCard({ donorId, donorName, bloodGroup, contact }: DonorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `BloodBridge_DonorCard_${donorId}.png`;
      link.click();
    }
  };

  const qrData = `bloodbridge://donor/${donorId}/${bloodGroup}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <div 
        ref={cardRef} 
        style={{
          width: '320px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--surface-raised)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-sans)'
        }}
        className="glass-panel"
      >
        {/* Header */}
        <div style={{ 
          background: 'var(--primary)', 
          color: 'white', 
          padding: '1.25rem', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>BloodBridge</h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>Official Donor Card</p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{donorName}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ID: {String(donorId).padStart(6, '0')}</p>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{contact}</p>
          </div>

          <div style={{
            background: 'rgba(229, 57, 70, 0.1)',
            border: '2px solid var(--primary)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: '2rem',
            fontWeight: 800
          }}>
            {bloodGroup}
          </div>

          <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px' }}>
            <QRCodeSVG value={qrData} size={100} level="H" includeMargin={false} />
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownload}
        style={{
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'var(--transition-smooth)',
          boxShadow: '0 4px 12px var(--primary-glow)'
        }}
        className="glow-button"
      >
        <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
        Download Digital Card
      </button>
    </div>
  );
}
