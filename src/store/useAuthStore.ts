import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: User, token: string, refreshToken?: string | null) => void;
  setToken: (token: string, refreshToken?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setUser: (user, token, refreshToken = null) => set({ user, token, refreshToken }),
      setToken: (token, refreshToken) =>
        set((state) => ({
          ...state,
          token,
          ...(refreshToken !== undefined ? { refreshToken } : {}),
        })),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
