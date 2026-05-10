import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, AppointmentStatus } from '../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },
      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        }));
      },
      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter((app) => app.patientId === patientId);
      },
      getAppointmentsByDoctor: (doctorId) => {
        return get().appointments.filter((app) => app.doctorId === doctorId);
      },
    }),
    {
      name: 'appointment-storage',
    }
  )
);
