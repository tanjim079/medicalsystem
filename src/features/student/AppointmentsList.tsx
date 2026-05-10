import { useState } from 'react';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import BookAppointmentModal from './BookAppointmentModal';
import { Calendar, Clock, User, CheckCircle, XCircle, Clock3 } from 'lucide-react';

export default function AppointmentsList() {
  const user = useAuthStore((s) => s.user);
  const getAppointmentsByPatient = useAppointmentStore(
    (s) => s.getAppointmentsByPatient
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const appointments = user ? getAppointmentsByPatient(user.id) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle size={14} /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
            <Clock3 size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No appointments found. Book one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <User size={18} className="text-blue-500" />
                    {app.doctorName}
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {app.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {app.time}
                  </div>
                </div>

                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Symptoms:</span> {app.symptoms}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BookAppointmentModal onClose={() => setIsModalOpen(false)} />
      )}
    </Card>
  );
}
