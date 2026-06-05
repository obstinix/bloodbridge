import { apiRequest } from './client';
import { BloodDrive } from '@/types/drive';

export async function getDrives(): Promise<BloodDrive[]> {
  return apiRequest<BloodDrive[]>('/api/drives');
}

export async function createDrive(drive: Omit<BloodDrive, 'id'>): Promise<BloodDrive> {
  return apiRequest<BloodDrive>('/api/drives', {
    method: 'POST',
    body: JSON.stringify(drive),
  });
}
