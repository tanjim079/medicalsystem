import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import BookAppointmentModal from './BookAppointmentModal';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Clock3,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  Ticket,
  Copy,
  CheckCheck,
} from 'lucide-react';

export default function AppointmentsList() {
  const user = useAuthStore((s) => s.user);
  const deleteAppointment = useAppointmentStore((s) => s.deleteAppointment);
  const allAppointments = useAppointmentStore((s) => s.appointments);
  const appointments = user ? allAppointments.filter((app) => app.patientId === user.id) : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteAppointment(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const confirmClearAll = () => {
    appointments.forEach((app) => deleteAppointment(app.id));
    setShowClearAllConfirm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle size={14} className="text-emerald-600" /> Accepted & Confirmed
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-800 bg-red-100/90 px-2.5 py-1 rounded-full border border-red-200">
            <XCircle size={14} className="text-red-600" /> Declined by Doctor
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock3 size={14} className="text-amber-600" /> Pending Approval
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
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">My Appointments</h2>
            <p className="text-xs text-gray-500">Track and manage your scheduled consultations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {appointments.length > 0 && (
            <button
              onClick={() => setShowClearAllConfirm(true)}
              className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Calendar size={16} />
            Book Appointment
          </button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-600 font-semibold">No appointments found.</p>
          <p className="text-xs text-gray-400 mt-1">Book a consultation slot with a specialist to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Left accent border based on status */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  app.status === 'accepted'
                    ? 'bg-emerald-500'
                    : app.status === 'rejected'
                    ? 'bg-red-400'
                    : 'bg-amber-400'
                }`}
              ></div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                      <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                        <User size={18} />
                      </div>
                      {app.doctorName}
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                      <button
                        onClick={() => setDeleteTargetId(app.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        title="Cancel & delete appointment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar size={15} className="text-indigo-500" />
                      <span className="font-semibold text-gray-700">{app.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Clock size={15} className="text-emerald-500" />
                      <span className="font-semibold text-gray-700">{app.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-2xs group/serial">
                      <Ticket size={13} className="text-indigo-600 flex-shrink-0" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 font-sans">Token</span>
                      <strong className="font-extrabold text-indigo-900">{app.serialNumber || 'N/A'}</strong>
                      {app.serialNumber && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(app.serialNumber!);
                            setCopiedId(app.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="text-indigo-400 hover:text-indigo-800 p-0.5 rounded transition-colors ml-0.5"
                          title="Copy serial token"
                          aria-label="Copy serial token"
                        >
                          {copiedId === app.id ? (
                            <CheckCheck size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      )}
                    </div>
                    {app.status === 'accepted' ? (
                      <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold">
                        <Lock size={12} /> Slot Confirmed
                      </div>
                    ) : app.status === 'rejected' ? (
                      <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 text-xs font-semibold">
                        <Unlock size={12} /> Slot Released
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 text-xs font-semibold">
                        <Lock size={12} /> Slot Reserved
                      </div>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wider block mb-0.5">
                      Symptoms / Reason
                    </span>
                    {app.symptoms}
                  </div>

                  {app.status === 'rejected' && (
                    <div className="p-3 bg-red-50/80 border border-red-100 rounded-xl text-xs text-red-700 flex items-center justify-between">
                      <span>The doctor declined this request. This slot is now free. You can schedule another consultation.</span>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-bold text-red-700 hover:text-red-900 underline ml-2 whitespace-nowrap"
                      >
                        Book New
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete Single Appointment */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500">This action will release your reserved time slot.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to cancel and remove this appointment? The consultation time slot will become free for other patients.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                Yes, Cancel & Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Clear All Appointments?</h3>
                <p className="text-xs text-slate-500">This will remove all your scheduled visits.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to clear all your appointments? Any time slots you have booked or reserved will be released immediately.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearAll}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <BookAppointmentModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
