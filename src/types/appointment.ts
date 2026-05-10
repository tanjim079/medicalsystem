export type AppointmentStatus = 'pending' | 'accepted' | 'rejected';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  status: AppointmentStatus;
  createdAt: string;
  tokenNumber?: string;
}
