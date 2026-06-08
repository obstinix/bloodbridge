'use client';

import React from 'react';
import Button from '@/components/Button/Button';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--canvas)',
      color: 'var(--ink)',
      fontFamily: 'var(--font-ui)',
      padding: 'var(--space-6)',
      textAlign: 'center',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: 'var(--canvas-raised)',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        maxWidth: '450px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-5)',
        boxShadow: 'var(--shadow-elevated)',
      }}>
        {/* Large 48px teardrop blood icon */}
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" strokeWidth="1.5">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <line x1="1" y1="1" x2="23" y2="23" stroke="var(--ink-muted)" strokeWidth="1.5" />
        </svg>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-title)',
          fontStyle: 'italic',
          margin: 0,
        }}>
          Connection Lost
        </h1>

        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--ink-muted)',
          lineHeight: 1.5,
          margin: 0,
        }}>
          You are currently offline. BloodBridge will attempt to reconnect automatically when your signal returns.
        </p>

        <Button variant="primary" onClick={handleRetry} fullWidth>
          Retry Connection
        </Button>
      </div>
    </div>
  );
}
