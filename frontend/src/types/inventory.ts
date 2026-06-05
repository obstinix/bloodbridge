import { BloodGroup } from '../constants/bloodGroups';

export interface InventoryItem {
  bloodGroup: BloodGroup;
  units: number;
  expiryDate: string;
  status: 'Critical' | 'Low' | 'Adequate' | 'Surplus';
  bloodBankId: string;
}
