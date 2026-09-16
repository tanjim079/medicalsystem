import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import { areTimesEqual, formatTimeTo12Hour } from '../utils/timeSlots';
import { validateBookingDate, formatLocalDate } from '../utils/dateUtils';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ) => { success: boolean; message?: string; appointment?: Appointment };
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus
  ) => { success: boolean; message?: string };
  isSlotBooked: (
    doctorId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ) => boolean;
  getBookedSlots: (doctorId: string, date: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  deleteAppointment: (id: string) => void;
  getNextSerialNumber: (date: string) => string;
  sanitizeSerials: () => void;
}

/**
 * Ensures any historical duplicate or missing serial numbers in persisted storage are resolved.
 */
function sanitizeAppointments(appointments: Appointment[]): { sanitized: Appointment[]; changed: boolean } {
  const seenSerials = new Set<string>();
  const dateCounters: Record<string, number> = {};
  let changed = false;

  // First pass: register all already-valid unique serial numbers
  appointments.forEach((app) => {
    const dateCode = (app.date || formatLocalDate(new Date())).replace(/-/g, '');
    const prefix = `APT-${dateCode}-`;

    if (app.serialNumber && app.serialNumber.startsWith(prefix) && !seenSerials.has(app.serialNumber)) {
      seenSerials.add(app.serialNumber);
      const match = app.serialNumber.match(/^APT-\d{8}-(\d+)$/);
      const num = match ? parseInt(match[1], 10) : 0;
      dateCounters[dateCode] = Math.max(dateCounters[dateCode] || 0, num);
    }
  });

  // Second pass: fix duplicates or missing serials
  const processedSeen = new Set<string>();
  const sanitized = appointments.map((app) => {
    const dateCode = (app.date || formatLocalDate(new Date())).replace(/-/g, '');
    const prefix = `APT-${dateCode}-`;

    const isValid =
      Boolean(app.serialNumber) &&
      app.serialNumber!.startsWith(prefix) &&
      !processedSeen.has(app.serialNumber!);

    if (isValid && app.serialNumber) {
      processedSeen.add(app.serialNumber);
      return app;
    }

    changed = true;
    let nextNum = (dateCounters[dateCode] || 0) + 1;
    let candidate = `${prefix}${nextNum.toString().padStart(3, '0')}`;
    while (seenSerials.has(candidate) || processedSeen.has(candidate)) {
      nextNum++;
      candidate = `${prefix}${nextNum.toString().padStart(3, '0')}`;
    }

    dateCounters[dateCode] = nextNum;
    seenSerials.add(candidate);
    processedSeen.add(candidate);

    return {
      ...app,
      serialNumber: candidate,
    };
  });

  return { sanitized, changed };
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],

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

        // Extract numbers from existing appointments matching this consultation date's prefix
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

        // Collision guard: ensure uniqueness against any appointment currently in store
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

      sanitizeSerials: () => {
        const { sanitized, changed } = sanitizeAppointments(get().appointments);
        if (changed) {
          set({ appointments: sanitized });
        }
      },

      addAppointment: (appointmentData) => {
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

        // Generate guaranteed unique, date-scoped sequential serial token
        const serialNumber =
          appointmentData.serialNumber || get().getNextSerialNumber(appointmentData.date);

        const formattedTime = formatTimeTo12Hour(appointmentData.time) || appointmentData.time;

        const newAppointment: Appointment = {
          ...appointmentData,
          time: formattedTime,
          id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          serialNumber,
        };

        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));

        return { success: true, appointment: newAppointment };
      },

      updateAppointmentStatus: (id, status) => {
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

        set((state) => ({
          appointments: state.appointments.map((app) =>
            app.id === id ? { ...app, status } : app
          ),
        }));

        return { success: true };
      },

      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter((app) => app.patientId === patientId);
      },

      getAppointmentsByDoctor: (doctorId) => {
        return get().appointments.filter((app) => app.doctorId === doctorId);
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((app) => app.id !== id),
        }));
      },
    }),
    {
      name: 'appointment-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.sanitizeSerials();
        }
      },
    }
  )
);
