import { useState } from 'react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Check,
  X,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Clock3,
  Lock,
  Unlock,
  AlertTriangle,
} from 'lucide-react';
import type { AppointmentStatus } from '../../types/appointment';

type Tab = 'pending' | 'accepted' | 'rejected' | 'all';

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user);
  const appointments = useAppointmentStore((s) => s.appointments);
  const updateAppointmentStatus = useAppointmentStore((s) => s.updateAppointmentStatus);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [declineTarget, setDeclineTarget] = useState<{
    id: string;
    patientName: string;
    date: string;
    time: string;
    isAccepted: boolean;
  } | null>(null);

  if (!user || user.role !== 'doctor') return null;

  const myAppointments = appointments.filter((app) => app.doctorId === user.id);

  const filteredAppointments = myAppointments.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const handleAccept = (id: string) => {
    const res = updateAppointmentStatus(id, 'accepted');
    if (!res.success) {
      alert(res.message);
    } else {
      setStatusNotification('Appointment accepted. This time slot is now confirmed and blocked for all patients.');
      setTimeout(() => setStatusNotification(null), 4000);
    }
  };

  const confirmDeclineAppointment = () => {
    if (!declineTarget) return;

    updateAppointmentStatus(declineTarget.id, 'rejected');
    setStatusNotification(
      `Appointment for ${declineTarget.patientName} was declined. The time slot (${declineTarget.date} at ${declineTarget.time}) is now released and free for other patients.`
    );
    setDeclineTarget(null);
    setTimeout(() => setStatusNotification(null), 5000);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle size={13} className="text-emerald-600" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-800 bg-red-100/80 px-2.5 py-1 rounded-full border border-red-200">
            <XCircle size={13} className="text-red-600" /> Declined
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock3 size={13} className="text-amber-600" /> Pending Review
          </span>
        );
    }
  };

  const getSlotStatePill = (status: AppointmentStatus) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            <Lock size={12} className="text-indigo-600" /> Slot Blocked
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Unlock size={12} className="text-emerald-600" /> Slot Released & Free
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <Lock size={12} className="text-amber-600" /> Slot Reserved (Pending)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Appointments Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review patient appointment requests. Accepting blocks the slot; declining releases it for others.
        </p>
      </div>

      {statusNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-sm shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto border border-slate-200/60">
        {[
          { key: 'pending', label: 'Pending Requests' },
          { key: 'accepted', label: 'Accepted (Blocked)' },
          { key: 'rejected', label: 'Declined (Free)' },
          { key: 'all', label: 'All Appointments' },
        ].map((tab) => {
          const count =
            tab.key === 'all'
              ? myAppointments.length
              : myAppointments.filter((a) => a.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
          <Calendar className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold text-slate-700">No appointments found in this category.</p>
          <p className="text-xs text-slate-400 mt-1">
            New patient booking requests will appear in the Pending tab.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <User size={18} />
                      </div>
                      {app.patientName}
                    </div>
                    {getStatusBadge(app.status)}
                    {getSlotStatePill(app.status)}
                  </div>

                  <div className="text-xs text-slate-500 font-medium ml-8 flex items-center gap-3">
                    <span>ID: <strong className="text-slate-700">{app.patientId}</strong></span>
                    <span>•</span>
                    <span>Serial: <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">{app.serialNumber || 'N/A'}</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(app.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-bold text-xs shadow-sm hover:shadow active:scale-95"
                      >
                        <Check size={15} strokeWidth={2.5} /> Accept (Block Slot)
                      </button>
                      <button
                        onClick={() =>
                          setDeclineTarget({
                            id: app.id,
                            patientName: app.patientName,
                            date: app.date,
                            time: app.time,
                            isAccepted: false,
                          })
                        }
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition font-bold text-xs active:scale-95"
                      >
                        <X size={15} strokeWidth={2.5} /> Decline (Free Slot)
                      </button>
                    </>
                  )}

                  {app.status === 'accepted' && (
                    <button
                      onClick={() =>
                        setDeclineTarget({
                          id: app.id,
                          patientName: app.patientName,
                          date: app.date,
                          time: app.time,
                          isAccepted: true,
                        })
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition font-semibold text-xs active:scale-95"
                    >
                      <X size={14} /> Decline & Free Slot
                    </button>
                  )}
                </div>
              </div>

              {/* Date & Time pills */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4 sm:ml-8">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Calendar size={15} className="text-indigo-500" />
                  <span className="font-semibold text-slate-700">{app.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock size={15} className="text-emerald-600" />
                  <span className="font-semibold text-slate-700">{app.time}</span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-100 sm:ml-8">
                <span className="font-bold block mb-1 text-slate-500 text-[11px] uppercase tracking-wider">
                  Symptoms / Reason
                </span>
                {app.symptoms}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Declining Appointment */}
      {declineTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Decline Appointment?</h3>
                <p className="text-xs text-slate-500">
                  {declineTarget.patientName} • {declineTarget.date} at {declineTarget.time}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              {declineTarget.isAccepted
                ? 'Are you sure you want to decline this previously confirmed appointment? The time slot will immediately be released and become free for any patient to book.'
                : 'Decline this consultation request? The time slot will remain free for other patients to book.'}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineTarget(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeclineAppointment}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                Yes, Decline & Free Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
