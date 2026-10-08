import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "patient" | "student" | "teacher" | "officer" | "admin" | "receptionist" | "pathologist";
  created_at?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface UserState {
  users: UserProfile[];
  loading: boolean;
  fetchUsers: (role?: string) => Promise<void>;
  getDoctors: () => UserProfile[];
  addUser: (userData: Omit<UserProfile, 'id'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<UserProfile>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async (role?: string) => {
    set({ loading: true });
    try {
      const query = role ? `?role=${role}` : '';
      const response = await fetchAuth(`${API_URL}/users${query}`);
      if (response.ok) {
        const data = await response.json();
        set({ users: data });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ loading: false });
    }
  },

  getDoctors: () => {
    return get().users.filter(u => u.role === 'doctor');
  },

  addUser: async (userData: Omit<UserProfile, 'id'>) => {
    try {
      const response = await fetchAuth(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const newUser = await response.json();
        set((state) => ({ users: [...state.users, newUser] }));
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  },

  updateUser: async (id: string, userData: Partial<UserProfile>) => {
    try {
      const response = await fetchAuth(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
        }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await fetchAuth(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}));
