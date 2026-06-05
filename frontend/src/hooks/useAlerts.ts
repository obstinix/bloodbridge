import { useEffect, useState } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import { BloodRequest } from '@/types/request';
import { useWebSocket } from './useWebSocket';

export function useAlerts() {
  const { alerts, addAlert, dismissAlert, disasterMode } = useAlertStore();
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('emergency_request', (req: BloodRequest) => {
      addAlert(req);
    });

    return () => {
      socket.off('emergency_request');
    };
  }, [socket, addAlert]);

  return {
    alerts,
    dismissAlert,
    disasterMode,
  };
}
