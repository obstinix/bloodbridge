import { apiRequest } from './client';
import { BloodRequest } from '@/types/request';

export async function getRequests(): Promise<BloodRequest[]> {
  return apiRequest<BloodRequest[]>('/api/requests');
}

export async function createRequest(request: Omit<BloodRequest, 'id'>): Promise<BloodRequest> {
  return apiRequest<BloodRequest>('/api/requests', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
