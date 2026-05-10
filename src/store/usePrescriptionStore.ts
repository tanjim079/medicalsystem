import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PrescriptionMedicine {
    medicineId: string;
    name: string;
    dosage: string;
    days: string;
}

export interface Prescription {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    date: string;
    problem: string;
    medicines: PrescriptionMedicine[];
    status: 'pending' | 'dispensed';
}

interface PrescriptionState {
    prescriptions: Prescription[];
    addPrescription: (prescription: Omit<Prescription, 'id' | 'date' | 'status'>) => void;
    getPrescriptionsByPatient: (patientId: string) => Prescription[];
    updatePrescriptionStatus: (id: string, status: 'dispensed') => void;
}

export const usePrescriptionStore = create<PrescriptionState>()(
    persist(
        (set, get) => ({
            prescriptions: [],
            addPrescription: (prescriptionData) => {
                const newPrescription: Prescription = {
                    ...prescriptionData,
                    id: Math.random().toString(36).substring(2, 9),
                    date: new Date().toISOString(),
                    status: 'pending',
                };
                set((state) => ({
                    prescriptions: [...state.prescriptions, newPrescription],
                }));
            },
            getPrescriptionsByPatient: (patientId) => {
                return get().prescriptions.filter((p) => p.patientId.toLowerCase() === patientId.toLowerCase());
            },
            updatePrescriptionStatus: (id, status) => {
                set((state) => ({
                    prescriptions: state.prescriptions.map((p) =>
                        p.id === id ? { ...p, status } : p
                    ),
                }));
            },
        }),
        {
            name: 'prescription-storage',
        }
    )
);
