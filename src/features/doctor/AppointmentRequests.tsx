import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Check, X, Calendar, Clock, User } from 'lucide-react';

export default function AppointmentRequests() {
  const user = useAuthStore((s) => s.user);
  const getAppointmentsByDoctor = useAppointmentStore((s) => s.getAppointmentsByDoctor);
  const updateAppointmentStatus = useAppointmentStore((s) => s.updateAppointmentStatus);

  if (!user || user.role !== 'doctor') return null;

  const appointments = getAppointmentsByDoctor(user.id);
  const pendingAppointments = appointments.filter((app) => app.status === 'pending');

  if (pendingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Requests</h2>
        <p className="text-gray-500 text-sm">No new requests pending.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Appointment Requests</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {pendingAppointments.length} New
        </span>
      </div>

      <div className="space-y-4">
        {pendingAppointments.map((app) => (
          <div key={app.id} className="border border-gray-100 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <User size={16} className="text-blue-500" />
                {app.patientName} <span className="text-sm font-normal text-gray-500">({app.patientId})</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateAppointmentStatus(app.id, 'accepted')}
                  className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                  title="Accept"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => updateAppointmentStatus(app.id, 'rejected')}
                  className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  title="Reject"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={14} /> {app.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} /> {app.time}
              </div>
            </div>

            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-100">
              <span className="font-medium">Symptoms:</span> {app.symptoms}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
