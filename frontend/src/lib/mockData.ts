// All mock data for development — replace with API calls later

export const MOCK_INVENTORY = [
  { bloodType: 'A+', units: 245, maxCapacity: 400, lastUpdated: '2 min ago' },
  { bloodType: 'A-', units: 48, maxCapacity: 200, lastUpdated: '5 min ago' },
  { bloodType: 'B+', units: 312, maxCapacity: 400, lastUpdated: '1 min ago' },
  { bloodType: 'B-', units: 22, maxCapacity: 200, lastUpdated: '8 min ago' },
  { bloodType: 'AB+', units: 89, maxCapacity: 200, lastUpdated: '3 min ago' },
  { bloodType: 'AB-', units: 11, maxCapacity: 100, lastUpdated: '12 min ago' },
  { bloodType: 'O+', units: 478, maxCapacity: 500, lastUpdated: '30 sec ago' },
  { bloodType: 'O-', units: 9, maxCapacity: 200, lastUpdated: 'Just now' },
] as const;

export const MOCK_EMERGENCY_REQUESTS = [
  {
    id: 'req-001',
    bloodType: 'O-',
    unitsNeeded: 4,
    urgency: 'critical',
    hospital: 'City General Hospital',
    location: 'Mumbai Central',
    distance: 1.2,
    postedAt: '3 min ago',
  },
  {
    id: 'req-002',
    bloodType: 'A-',
    unitsNeeded: 6,
    urgency: 'critical',
    hospital: 'Apollo Emergency Care',
    location: 'Bandra West',
    distance: 3.5,
    postedAt: '7 min ago',
  },
  {
    id: 'req-003',
    bloodType: 'B+',
    unitsNeeded: 10,
    urgency: 'urgent',
    hospital: 'Fortis Memorial Inst.',
    location: 'Andheri East',
    distance: 5.1,
    postedAt: '15 min ago',
  },
  {
    id: 'req-004',
    bloodType: 'O+',
    unitsNeeded: 8,
    urgency: 'standard',
    hospital: 'Lilavati Hospital',
    location: 'Bandra Reclamation',
    distance: 2.8,
    postedAt: '24 min ago',
  },
  {
    id: 'req-005',
    bloodType: 'AB-',
    unitsNeeded: 2,
    urgency: 'critical',
    hospital: 'Tata Memorial Center',
    location: 'Parel',
    distance: 4.0,
    postedAt: '45 min ago',
  },
] as const;

export const MOCK_DONOR_STATS = {
  totalDonations: 7,
  lifetimeLiters: 3.5,
  daysUntilEligible: 14,
  livesSaved: 21,
};

export const MOCK_FORECAST_DATA = Array.from({ length: 44 }, (_, i) => ({
  date: `Day ${i + 1}`,
  historical: i < 30 ? Math.floor(80 + Math.random() * 40) : null,
  predicted: i >= 28 ? Math.floor(85 + Math.random() * 50) : null,
  lower: i >= 28 ? Math.floor(70 + Math.random() * 30) : null,
  upper: i >= 28 ? Math.floor(100 + Math.random() * 60) : null,
}));
