import { create } from 'zustand';

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
    tests: { id: string; name: string }[];
    advice: string;
    status: 'pending' | 'dispensed';
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface PrescriptionState {
    prescriptions: Prescription[];
    loading: boolean;
    fetchPrescriptions: () => Promise<void>;
    addPrescription: (prescription: Omit<Prescription, 'id' | 'date' | 'status'>) => Promise<Prescription | null>;
    getPrescriptionsByPatient: (patientId: string) => Prescription[];
    updatePrescriptionStatus: (id: string, status: 'dispensed') => Promise<boolean>;
}

export const usePrescriptionStore = create<PrescriptionState>()((set, get) => ({
    prescriptions: [],
    loading: false,
    
    fetchPrescriptions: async () => {
        set({ loading: true });
        try {
            const res = await fetch(`${API_URL}/prescriptions`);
            if (res.ok) {
                const data = await res.json();
                set({ prescriptions: data });
            }
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        } finally {
            set({ loading: false });
        }
    },
    
    addPrescription: async (prescriptionData) => {
        const payload = {
            ...prescriptionData,
            status: 'pending'
        };
        try {
            const res = await fetch(`${API_URL}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const newPrescription = await res.json();
                set((state) => ({
                    prescriptions: [...state.prescriptions, newPrescription],
                }));
                return newPrescription;
            }
            return null;
        } catch (error) {
            console.error("Error adding prescription:", error);
            return null;
        }
    },
    
    getPrescriptionsByPatient: (patientId) => {
        return get().prescriptions.filter((p) => p.patientId.toLowerCase() === patientId.toLowerCase());
    },
    
    updatePrescriptionStatus: async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                set((state) => ({
                    prescriptions: state.prescriptions.map((p) =>
                        p.id === id ? updated : p
                    ),
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error updating prescription status:", error);
            return false;
        }
    },
}));
