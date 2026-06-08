import { useState, useEffect } from 'react';
import { MOCK_INVENTORY, MOCK_EMERGENCY_REQUESTS } from './mockData';
import { BloodType } from '@/components/BloodTypeBadge/BloodTypeBadge';

export interface SimulatedInventoryItem {
  bloodType: BloodType;
  units: number;
  maxCapacity: number;
  lastUpdated: string;
}

export interface SimulatedEmergencyRequest {
  id: string;
  bloodType: BloodType;
  unitsNeeded: number;
  urgency: string;
  hospital: string;
  location: string;
  distance: number;
  postedAt: string;
}

export function useRealTimeInventory(): SimulatedInventoryItem[] {
  const [inventory, setInventory] = useState<SimulatedInventoryItem[]>(MOCK_INVENTORY as any);

  useEffect(() => {
    const interval = setInterval(() => {
      setInventory((prev) =>
        prev.map(item => ({
          ...item,
          units: Math.max(
            0,
            Math.min(
              item.maxCapacity,
              item.units + Math.floor((Math.random() - 0.48) * 5)
            )
          ),
          lastUpdated: 'Just now',
        }))
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return inventory;
}

export function useRealTimeRequests(): SimulatedEmergencyRequest[] {
  const [requests, setRequests] = useState<SimulatedEmergencyRequest[]>(MOCK_EMERGENCY_REQUESTS as any);

  useEffect(() => {
    const delay = 25000 + Math.random() * 20000;
    const timeout = setTimeout(() => {
      const newReq: SimulatedEmergencyRequest = {
        id: `req-${Date.now()}`,
        bloodType: (['O-', 'A+', 'B-', 'AB+'] as const)[
          Math.floor(Math.random() * 4)
        ],
        unitsNeeded: Math.floor(Math.random() * 4) + 1,
        urgency: (Math.random() > 0.7 ? 'critical' : 'urgent') as 'critical' | 'urgent',
        hospital: ['City Medical Center', 'Apollo Hospital', 'Lilavati Hospital'][
          Math.floor(Math.random() * 3)
        ],
        location: 'Mumbai Central',
        distance: +(Math.random() * 10).toFixed(1),
        postedAt: 'Just now',
      };
      setRequests(prev => [newReq, ...prev.slice(0, 9)]);
    }, delay);
    return () => clearTimeout(timeout);
  }, [requests]);

  return requests;
}
