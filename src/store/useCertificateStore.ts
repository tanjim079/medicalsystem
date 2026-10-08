import { fetchAuth } from '../lib/fetchAuth';
import { create } from "zustand";

export interface MedicalCertificate {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string; // Date of issue
  diagnosis: string;
  restStartDate: string;
  restEndDate: string;
  recommendedRestDays: number;
  remarks: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface CertificateState {
  certificates: MedicalCertificate[];
  loading: boolean;
  fetchCertificates: () => Promise<void>;
  addCertificate: (cert: Omit<MedicalCertificate, "id" | "date">) => Promise<MedicalCertificate | null>;
  getCertificatesByPatient: (patientId: string) => MedicalCertificate[];
  getCertificateById: (id: string) => MedicalCertificate | undefined;
}

export const useCertificateStore = create<CertificateState>()((set, get) => ({
  certificates: [],
  loading: false,

  fetchCertificates: async () => {
    set({ loading: true });
    try {
      const res = await fetchAuth(`${API_URL}/certificates`);
      if (res.ok) {
        const data = await res.json();
        set({ certificates: data });
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      set({ loading: false });
    }
  },

  addCertificate: async (cert) => {
    try {
      const res = await fetchAuth(`${API_URL}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cert),
      });
      if (res.ok) {
        const newCert = await res.json();
        set((state) => ({
          certificates: [...state.certificates, newCert],
        }));
        return newCert;
      }
      return null;
    } catch (error) {
      console.error("Error adding certificate:", error);
      return null;
    }
  },

  getCertificatesByPatient: (patientId) => {
    return get().certificates.filter((c) => c.patientId === patientId);
  },

  getCertificateById: (id) => {
    return get().certificates.find((c) => c.id === id);
  },
}));
