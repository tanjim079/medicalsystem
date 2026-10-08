import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import { areTimesEqual, formatTimeTo12Hour } from '../utils/timeSlots';
import { validateBookingDate, formatLocalDate } from '../utils/dateUtils';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  fetchAppointments: () => Promise<void>;
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ) => Promise<{ success: boolean; message?: string; appointment?: Appointment }>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus
  ) => Promise<{ success: boolean; message?: string }>;
  isSlotBooked: (
    doctorId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ) => boolean;
  getBookedSlots: (doctorId: string, date: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  deleteAppointment: (id: string) => Promise<void>;
  getNextSerialNumber: (date: string) => string;
}

export const useAppointmentStore = create<AppointmentState>()((set, get) => ({
  appointments: [],
  loading: false,

  fetchAppointments: async () => {
    set({ loading: true });
    try {
      const response = await fetchAuth(`${API_URL}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      set({ appointments: data });
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      set({ loading: false });
    }
  },

  isSlotBooked: (doctorId, date, time, excludeAppointmentId) => {
    if (!doctorId || !date || !time) return false;
    return get().appointments.some(
      (app) =>
        app.id !== excludeAppointmentId &&
        app.doctorId === doctorId &&
        app.date === date &&
        areTimesEqual(app.time, time) &&
        (app.status === 'pending' || app.status === 'accepted')
    );
  },

  getBookedSlots: (doctorId, date) => {
    if (!doctorId || !date) return [];
    return get().appointments.filter(
      (app) =>
        app.doctorId === doctorId &&
        app.date === date &&
        (app.status === 'pending' || app.status === 'accepted')
    );
  },

  getNextSerialNumber: (date: string) => {
    const dateCode = (date || formatLocalDate(new Date())).replace(/-/g, '');
    const prefix = `APT-${dateCode}-`;

    const existingNumbers = get().appointments
      .map((app) => {
        if (!app.serialNumber) return 0;
        const match = app.serialNumber.match(/^APT-(\d{8})-(\d+)$/);
        if (match && match[1] === dateCode) {
          return parseInt(match[2], 10);
        }
        return 0;
      })
      .filter((n) => !isNaN(n) && n > 0);

    const maxSerial = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    let nextSerialNum = maxSerial + 1;

    const existingSerialSet = new Set(
      get().appointments.map((a) => a.serialNumber).filter(Boolean)
    );

    let candidateSerial = `${prefix}${nextSerialNum.toString().padStart(3, '0')}`;
    while (existingSerialSet.has(candidateSerial)) {
      nextSerialNum++;
      candidateSerial = `${prefix}${nextSerialNum.toString().padStart(3, '0')}`;
    }

    return candidateSerial;
  },

  addAppointment: async (appointmentData) => {
    const dateValidation = validateBookingDate(appointmentData.date);
    if (!dateValidation.isValid) {
      return {
        success: false,
        message: dateValidation.error || 'Invalid appointment date.',
      };
    }

    const isBooked = get().isSlotBooked(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.time
    );

    if (isBooked) {
      const displayTime = formatTimeTo12Hour(appointmentData.time) || appointmentData.time;
      return {
        success: false,
        message: `The time slot ${displayTime} on ${appointmentData.date} is already booked or pending approval. Please select an available time.`,
      };
    }

    const serialNumber = appointmentData.serialNumber || get().getNextSerialNumber(appointmentData.date);
    const formattedTime = formatTimeTo12Hour(appointmentData.time) || appointmentData.time;

    const payload = {
      ...appointmentData,
      time: formattedTime,
      status: 'pending',
      serialNumber,
    };

    try {
      const response = await fetchAuth(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to create appointment");
      const newAppointment = await response.json();
      
      set((state) => ({ appointments: [...state.appointments, newAppointment] }));
      return { success: true, appointment: newAppointment };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  updateAppointmentStatus: async (id, status) => {
    const targetApp = get().appointments.find((app) => app.id === id);
    if (!targetApp) {
      return { success: false, message: 'Appointment not found.' };
    }

    if (status === 'accepted') {
      const conflict = get().appointments.find(
        (app) =>
          app.id !== id &&
          app.doctorId === targetApp.doctorId &&
          app.date === targetApp.date &&
          areTimesEqual(app.time, targetApp.time) &&
          app.status === 'accepted'
      );

      if (conflict) {
        return {
          success: false,
          message: `Conflict: Dr. ${targetApp.doctorName} already has an accepted appointment at ${targetApp.time} on ${targetApp.date}.`,
        };
      }
    }

    try {
      const response = await fetchAuth(`${API_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Failed to update status");
      const updated = await response.json();
      
      set((state) => ({
        appointments: state.appointments.map((app) => (app.id === id ? updated : app)),
      }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  getAppointmentsByPatient: (patientId) => {
    return get().appointments.filter((app) => app.patientId === patientId);
  },

  getAppointmentsByDoctor: (doctorId) => {
    return get().appointments.filter((app) => app.doctorId === doctorId);
  },

  deleteAppointment: async (id) => {
    try {
      await fetchAuth(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
      set((state) => ({
        appointments: state.appointments.filter((app) => app.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  },
}));
