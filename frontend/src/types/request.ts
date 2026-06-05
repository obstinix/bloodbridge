import { BloodGroup } from '../constants/bloodGroups';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: 'Critical' | 'Urgent' | 'Routine';
  status: 'Pending' | 'Matched' | 'In Transit' | 'Fulfilled' | 'Cancelled';
  requestedAt: string;
  matchedDonor?: string;
  notes?: string;
}
