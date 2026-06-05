import { create } from 'zustand';
import { InventoryItem } from '@/types/inventory';

interface InventoryStore {
  inventory: InventoryItem[];
  setInventory: (items: InventoryItem[]) => void;
  updateStock: (bloodGroup: string, units: number) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  inventory: [],
  setInventory: (inventory) => set({ inventory }),
  updateStock: (bloodGroup, units) => set((state) => {
    const exists = state.inventory.some((item) => item.bloodGroup === bloodGroup);
    if (exists) {
      return {
        inventory: state.inventory.map((item) =>
          item.bloodGroup === bloodGroup ? { ...item, units } : item
        ),
      };
    } else {
      return {
        inventory: [
          ...state.inventory,
          {
            bloodGroup: bloodGroup as any,
            units,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // default 30 days
            status: units < 5 ? 'Critical' : units < 20 ? 'Low' : 'Adequate',
            bloodBankId: 'default',
          },
        ],
      };
    }
  }),
}));
