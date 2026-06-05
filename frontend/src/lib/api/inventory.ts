import { apiRequest } from './client';
import { InventoryItem } from '@/types/inventory';

export async function getInventory(): Promise<InventoryItem[]> {
  return apiRequest<InventoryItem[]>('/api/inventory');
}
