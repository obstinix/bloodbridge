import { create } from 'zustand';
import { BloodRequest } from '@/types/request';

interface AlertStore {
  alerts: BloodRequest[];
  addAlert: (alert: BloodRequest) => void;
  dismissAlert: (id: string) => void;
  disasterMode: boolean;
  toggleDisasterMode: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts] })),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  disasterMode: false,
  toggleDisasterMode: () => set((s) => ({ disasterMode: !s.disasterMode })),
}));
