import { apiRequest } from './client';
import { Donor } from '@/types/donor';

export async function getDonors(): Promise<Donor[]> {
  return apiRequest<Donor[]>('/api/donors');
}

export async function createDonor(donor: Omit<Donor, 'id'>): Promise<Donor> {
  return apiRequest<Donor>('/api/donors', {
    method: 'POST',
    body: JSON.stringify(donor),
  });
}
