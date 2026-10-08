import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';

export interface Medicine {
  id: string;
  name: string;
  stock: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  fetchMedicines: () => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  addMedicine: (name: string, stock: number) => Promise<void>;
}

export const useMedicineStore = create<MedicineState>()((set) => ({
  medicines: [],
  loading: false,

  fetchMedicines: async () => {
    set({ loading: true });
    try {
      const response = await fetchAuth(`${API_URL}/medicines`);
      if (response.ok) {
        const data = await response.json();
        set({ medicines: data });
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateStock: async (id: string, newStock: number) => {
    try {
      const response = await fetchAuth(`${API_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      if (response.ok) {
        const updated = await response.json();
        set(state => ({
          medicines: state.medicines.map(m => m.id === id ? updated : m)
        }));
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  },

  addMedicine: async (name: string, stock: number) => {
    try {
      const response = await fetchAuth(`${API_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, stock })
      });
      if (response.ok) {
        const added = await response.json();
        set(state => ({
          medicines: [...state.medicines, added].sort((a, b) => a.name.localeCompare(b.name))
        }));
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  }
}));
