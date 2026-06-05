export interface BloodDrive {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  expectedDonors: number;
  registeredCount: number;
  status: 'Open' | 'Closed' | 'Completed';
  description?: string;
  contactPerson?: string;
  capacity?: number;
}
