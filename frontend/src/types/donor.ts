import { BloodGroup } from '../constants/bloodGroups';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  email: string;
  location: { lat: number; lng: number; city: string };
  lastDonated: string | null; // Use ISO string or date representation
  nextEligible: string;
  donationCount: number;
  streak: number;
  status: 'Available' | 'Recently Donated' | 'Ineligible' | 'On Leave';
  availability: 'Available' | 'Busy' | 'Traveling' | 'Ready to Donate';
  badges: string[]; // List of badge ids
  isRareBlood: boolean;
  rareBloodType?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}
