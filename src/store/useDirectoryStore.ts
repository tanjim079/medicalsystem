import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';

export interface DirectoryMember {
  id: string;
  name: string;
  category: "doctor" | "staff";
  designation: string;
  contact: string;
  email: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface DirectoryState {
  members: DirectoryMember[];
  loading: boolean;
  fetchDirectory: (category?: string) => Promise<void>;
}

export const useDirectoryStore = create<DirectoryState>()((set) => ({
  members: [],
  loading: false,

  fetchDirectory: async (category?: string) => {
    set({ loading: true });
    try {
      const query = category ? `?category=${category}` : '';
      const response = await fetchAuth(`${API_URL}/directory${query}`);
      if (response.ok) {
        const data = await response.json();
        set({ members: data });
      }
    } catch (error) {
      console.error("Error fetching directory:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
