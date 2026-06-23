'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EmergencyBanner, { CriticalAlert } from './EmergencyBanner';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';

const THRESHOLD = 0.15; // 15% capacity
const DISMISS_MS = 8000; // 8-second auto-dismiss
const DEBOUNCE_MS = 60_000; // 60-second cooldown before re-showing

export default function EmergencyBannerWrapper() {
  const inventory = useRealTimeInventory();

  const [visible, setVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<CriticalAlert | null>(null);

  // Track when the banner was last dismissed to debounce re-appearance
  const lastDismissedRef = useRef<number>(0);
  // Track the blood type currently being shown so we detect *new* critical types
  const shownTypeRef = useRef<string | null>(null);
  // Auto-dismiss timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    lastDismissedRef.current = Date.now();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Find ALL critical blood types (below 15% capacity)
    const criticalItems = inventory.filter(
      (item) => item.maxCapacity > 0 && item.units / item.maxCapacity < THRESHOLD
    );

    if (criticalItems.length === 0) {
      // Nothing critical — hide banner if showing
      if (visible) dismiss();
      shownTypeRef.current = null;
      return;
    }

    // Pick the worst (lowest ratio) critical item
    const worst = criticalItems.reduce((a, b) =>
      a.units / a.maxCapacity < b.units / b.maxCapacity ? a : b
    );

    const newAlert: CriticalAlert = {
      bloodType: worst.bloodType,
      units: worst.units,
    };

    // If banner is already visible for this same type, just update units
    if (visible && shownTypeRef.current === newAlert.bloodType) {
      setCurrentAlert(newAlert);
      return;
    }

    // Debounce: don't re-show within 60s of the last dismiss
    const elapsed = Date.now() - lastDismissedRef.current;
    if (elapsed < DEBOUNCE_MS) return;

    // Show the banner for a (possibly new) critical type
    shownTypeRef.current = newAlert.bloodType;
    setCurrentAlert(newAlert);
    setVisible(true);

    // Clear any existing timer & set a fresh 8s auto-dismiss
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dismiss();
    }, DISMISS_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory]);

  if (!visible || !currentAlert) return null;

  return (
    <EmergencyBanner
      alert={currentAlert}
      dismissMs={DISMISS_MS}
      onDismiss={dismiss}
    />
  );
}
