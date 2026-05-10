import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MedicalTest } from '../data/tests';

export type BillItem = MedicalTest;

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

interface BillingState {
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'date'>) => Bill;
  getBillsByPatient: (patientId: string) => Bill[];
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      bills: [],
      addBill: (billData) => {
        // Generate a random invoice ID like INV-5928
        const newBill: Bill = {
          ...billData,
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString(),
        };
        set((state) => ({
          bills: [...state.bills, newBill],
        }));
        return newBill;
      },
      getBillsByPatient: (patientId) => {
        return get().bills.filter((b) => b.patientId.toLowerCase() === patientId.toLowerCase());
      },
    }),
    {
      name: 'billing-storage',
    }
  )
);
