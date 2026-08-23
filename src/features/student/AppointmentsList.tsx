import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import BookAppointmentModal from './BookAppointmentModal';
import { Calendar, Clock, User, CheckCircle, XCircle, Clock3, Trash2 } from 'lucide-react';

export default function AppointmentsList() {
  const user = useAuthStore((s) => s.user);
  const deleteAppointment = useAppointmentStore((s) => s.deleteAppointment);
  const allAppointments = useAppointmentStore((s) => s.appointments);
  const appointments = user ? allAppointments.filter(app => app.patientId === user.id) : [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all your appointments?")) {
      appointments.forEach(app => deleteAppointment(app.id));
    }
  };

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Calendar size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">My Appointments</h2>
        </div>
        <div className="flex items-center gap-3">
          {appointments.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md active:scale-95"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No appointments found.</p>
          <p className="text-sm text-gray-400 mt-1">Book one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Subtle hover gradient indicator on left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                      <div className="bg-blue-50 p-1.5 rounded text-blue-600">
                        <User size={18} />
                      </div>
                      {app.doctorName}
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this appointment?")) {
                            deleteAppointment(app.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Delete appointment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar size={16} className="text-indigo-500" />
                      {app.date}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Clock size={16} className="text-emerald-500" />
                      {app.time}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                      <span className="text-xs uppercase tracking-wider text-blue-500 font-sans">Serial</span>
                      {app.serialNumber || 'N/A'}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                    <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider mr-2">Symptoms:</span>
                    {app.symptoms}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BookAppointmentModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
