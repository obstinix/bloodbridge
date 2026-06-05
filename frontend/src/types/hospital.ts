import { BloodGroup } from '../constants/bloodGroups';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  contact: string;
  activeRequests: number;
  inventory: Partial<Record<BloodGroup, number>>;
}
