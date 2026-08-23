import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

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

interface CertificateState {
  certificates: MedicalCertificate[];
  addCertificate: (cert: Omit<MedicalCertificate, "id" | "date">) => void;
  getCertificatesByPatient: (patientId: string) => MedicalCertificate[];
  getCertificateById: (id: string) => MedicalCertificate | undefined;
}

export const useCertificateStore = create<CertificateState>()(
  persist(
    (set, get) => ({
      certificates: [],

      addCertificate: (cert) => {
        set((state) => ({
          certificates: [
            ...state.certificates,
            {
              ...cert,
              id: uuidv4(),
              date: new Date().toISOString(),
            },
          ],
        }));
      },

      getCertificatesByPatient: (patientId) => {
        return get().certificates.filter((c) => c.patientId === patientId);
      },

      getCertificateById: (id) => {
        return get().certificates.find((c) => c.id === id);
      },
    }),
    {
      name: "medical-certificates-storage",
    }
  )
);
