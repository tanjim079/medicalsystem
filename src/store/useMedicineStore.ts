import { create } from 'zustand';
import { apiRequest } from '../features/admin/lib/adminApi';

export interface Medicine {
  id: string;
  name: string;
  stock: number;
}

export const LOW_STOCK_THRESHOLD = 10;

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
  fetchMedicines: () => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  updateMedicine: (id: string, patch: Partial<Pick<Medicine, 'name' | 'stock'>>) => Promise<void>;
  adjustStock: (id: string, delta: number) => Promise<void>;
  addMedicine: (name: string, stock: number) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
}

const sortByName = (list: Medicine[]) => [...list].sort((a, b) => a.name.localeCompare(b.name));

export const useMedicineStore = create<MedicineState>()((set, get) => ({
  medicines: [],
  loading: false,
  error: null,

  fetchMedicines: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<Medicine[]>('/medicines');
      set({ medicines: data || [] });
    } catch (error) {
      console.error("Error fetching medicines:", error);
      set({ error: error instanceof Error ? error.message : 'Failed to load medicines' });
    } finally {
      set({ loading: false });
    }
  },

  updateStock: async (id, newStock) => get().updateMedicine(id, { stock: newStock }),

  updateMedicine: async (id, patch) => {
    const updated = await apiRequest<Medicine>(`/medicines/${id}`, { method: 'PUT', json: patch });
    set(state => ({ medicines: sortByName(state.medicines.map(m => (m.id === id ? { ...m, ...updated } : m))) }));
  },

  adjustStock: async (id, delta) => {
    const updated = await apiRequest<Medicine>(`/medicines/${id}/adjust`, { method: 'PATCH', json: { delta } });
    set(state => ({ medicines: state.medicines.map(m => (m.id === id ? updated : m)) }));
  },

  addMedicine: async (name, stock) => {
    const added = await apiRequest<Medicine>('/medicines', { method: 'POST', json: { name, stock } });
    set(state => ({ medicines: sortByName([...state.medicines, added]) }));
  },

  deleteMedicine: async (id) => {
    await apiRequest(`/medicines/${id}`, { method: 'DELETE' });
    set(state => ({ medicines: state.medicines.filter(m => m.id !== id) }));
  },
}));
