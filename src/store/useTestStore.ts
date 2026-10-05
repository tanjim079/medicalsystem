import { create } from 'zustand';
import type { MedicalTest } from '../data/tests';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface TestStore {
  tests: MedicalTest[];
  loading: boolean;
  fetchTests: () => Promise<void>;
}

export const useTestStore = create<TestStore>((set, get) => ({
  tests: [],
  loading: false,
  fetchTests: async () => {
    if (get().tests.length > 0) return; // already fetched
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/tests`);
      if (res.ok) {
        const data = await res.json();
        set({ tests: data });
      }
    } catch (error) {
      console.error("Error fetching medical tests:", error);
    } finally {
      set({ loading: false });
    }
  }
}));
