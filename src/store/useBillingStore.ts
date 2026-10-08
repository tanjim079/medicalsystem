import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';

export interface BillItem {
  id: string;
  name: string;
  price: number;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  tests: BillItem[];
  subTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: "Cash" | "Card" | "Mobile Banking";
  status: "Paid" | "Due";
  date: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface BillingState {
  bills: Bill[];
  loading: boolean;
  fetchBills: () => Promise<void>;
  addBill: (bill: Omit<Bill, 'id' | 'date'>) => Promise<Bill | null>;
  updateBillStatus: (id: string, status: "Paid" | "Due") => Promise<void>;
  getBillsByPatient: (patientId: string) => Bill[];
}

export const useBillingStore = create<BillingState>()((set, get) => ({
  bills: [],
  loading: false,

  fetchBills: async () => {
    set({ loading: true });
    try {
      const res = await fetchAuth(`${API_URL}/billing`);
      if (res.ok) {
        const data = await res.json();
        set({ bills: data });
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      set({ loading: false });
    }
  },

  addBill: async (billData) => {
    const payload = {
      ...billData,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    };
    try {
      const res = await fetchAuth(`${API_URL}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newBill = await res.json();
        set((state) => ({ bills: [...state.bills, newBill] }));
        return newBill;
      }
      return null;
    } catch (error) {
      console.error("Error adding bill:", error);
      return null;
    }
  },

    updateBillStatus: async (id, status) => {
    try {
      const res = await fetchAuth(`${API_URL}/billing/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          bills: state.bills.map((b) => (b.id === id ? updated : b))
        }));
      }
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  },

  getBillsByPatient: (patientId) => {
    return get().bills.filter((b) => b.patientId.toLowerCase() === patientId.toLowerCase());
  },
}));

