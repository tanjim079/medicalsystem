import { create } from 'zustand';
import { apiRequest } from '../features/admin/lib/adminApi';

export type AccountType =
  | "student" | "teacher" | "officer" | "patient"
  | "doctor" | "receptionist" | "pathologist" | "pharmacist" | "staff" | "admin";

export interface PatientDetails {
  id?: string;
  roll_number?: string | null;
  registration_number?: string | null;
  phone?: string | null;
  blood_group?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  department?: string | null;
  age?: number | string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  /** Authoritative database role (public.profiles.role). */
  role: AccountType;
  /** Presentation-level account type (e.g. student/officer map to the `patient` role). */
  accountType?: AccountType;
  status?: "active" | "disabled";
  lastSignInAt?: string | null;
  emailConfirmed?: boolean | null;
  patients?: PatientDetails | null;
  created_at?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: AccountType;
  patientData?: {
    universityId?: string;
    phone?: string;
    bloodGroup?: string;
    guardianName?: string;
    guardianPhone?: string;
    department?: string;
    age?: string;
  };
  /** Doctors only: public website directory listing created with the account. */
  directoryListing?: {
    publish: boolean;
    designation?: string;
    contact?: string;
  };
}

interface UserState {
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  fetchUsers: (role?: string) => Promise<void>;
  getDoctors: () => UserProfile[];
  addUser: (userData: UserPayload) => Promise<UserProfile & { warning?: string; directoryEntry?: { id: string | number } }>;
  updateUser: (id: string, userData: Partial<UserPayload>) => Promise<void>;
  setUserStatus: (id: string, active: boolean) => Promise<void>;
  resetPassword: (id: string, password: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const accountTypeOf = (u: Pick<UserProfile, 'role' | 'accountType'>): AccountType => u.accountType || u.role;

export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (role?: string) => {
    set({ loading: true, error: null });
    try {
      const query = role ? `?role=${encodeURIComponent(role)}` : '';
      const data = await apiRequest<UserProfile[]>(`/users${query}`);
      set({ users: data || [] });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error instanceof Error ? error.message : 'Failed to load users' });
    } finally {
      set({ loading: false });
    }
  },

  getDoctors: () => get().users.filter(u => u.role === 'doctor'),

  addUser: async (userData) => {
    const created = await apiRequest<UserProfile & { warning?: string; directoryEntry?: { id: string | number } }>('/users', { method: 'POST', json: userData });
    set((state) => ({
      users: [...state.users, created].sort((a, b) => a.name.localeCompare(b.name)),
    }));
    return created;
  },

  updateUser: async (id, userData) => {
    const payload = { ...userData };
    if (!payload.password) delete payload.password;
    const updated = await apiRequest<Partial<UserProfile>>(`/users/${id}`, { method: 'PUT', json: payload });
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updated } : u)),
    }));
  },

  setUserStatus: async (id, active) => {
    const res = await apiRequest<{ status: "active" | "disabled" }>(`/users/${id}/status`, { method: 'PATCH', json: { active } });
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: res.status } : u)),
    }));
  },

  resetPassword: async (id, password) => {
    await apiRequest(`/users/${id}/password`, { method: 'PUT', json: { password } });
  },

  deleteUser: async (id) => {
    await apiRequest(`/users/${id}`, { method: 'DELETE' });
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
  },
}));
