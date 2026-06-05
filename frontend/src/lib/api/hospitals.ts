import { apiRequest } from './client';
import { Hospital } from '@/types/hospital';

export async function getHospitals(): Promise<Hospital[]> {
  return apiRequest<Hospital[]>('/api/hospitals');
}
