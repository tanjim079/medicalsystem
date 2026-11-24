import { create } from "zustand";
import { apiRequest, errorMessage } from "./adminApi";

export interface AdminStats {
  generatedAt: string;
  users: { total: number | null; byRole: Record<string, number>; newLast30Days: number };
  appointments: {
    total: number | null;
    today: number;
    byStatus: Record<string, number>;
    trend: { date: string; count: number }[];
    topDoctors: { doctorId: string; doctorName: string; total: number; pending: number }[];
  };
  clinical: { prescriptions: number | null; certificates: number | null };
  laboratory: { requests: number | null; pending: number; byStatus: Record<string, number>; reports: number | null; catalogSize: number | null };
  billing: { totalBills: number | null; revenueCollected: number; revenueDue: number; trend: { date: string; amount: number }[] };
  inventory: {
    totalMedicines: number | null;
    totalUnits: number;
    lowStockThreshold: number;
    lowStockCount: number;
    outOfStockCount: number;
    lowStock: { id: string; name: string; stock: number }[];
  };
  warnings: string[];
}

export interface ActivityEvent {
  id: string;
  type: "appointment" | "prescription" | "bill" | "user";
  title: string;
  description: string;
  timestamp: string;
}

interface AdminStatsState {
  stats: AdminStats | null;
  activity: ActivityEvent[];
  loading: boolean;
  error: string | null;
  lastLoaded: number;
  load: (force?: boolean) => Promise<void>;
}

const STALE_MS = 60_000;

export const useAdminStats = create<AdminStatsState>((set, get) => ({
  stats: null,
  activity: [],
  loading: false,
  error: null,
  lastLoaded: 0,
  load: async (force = false) => {
    const { loading, lastLoaded } = get();
    if (loading || (!force && Date.now() - lastLoaded < STALE_MS)) return;
    set({ loading: true, error: null });
    try {
      const [stats, activity] = await Promise.all([
        apiRequest<AdminStats>("/admin/stats"),
        apiRequest<{ events: ActivityEvent[] }>("/admin/activity?limit=12"),
      ]);
      set({ stats, activity: activity.events || [], lastLoaded: Date.now() });
    } catch (err) {
      set({ error: errorMessage(err, "Failed to load dashboard data") });
    } finally {
      set({ loading: false });
    }
  },
}));
