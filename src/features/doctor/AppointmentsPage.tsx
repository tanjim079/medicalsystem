import { useState } from 'react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Check, X, Calendar, Clock, User, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import type { AppointmentStatus } from '../../types/appointment';

type Tab = 'pending' | 'accepted' | 'rejected' | 'all';

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user);
  const appointments = useAppointmentStore((s) => s.appointments);
  const updateAppointmentStatus = useAppointmentStore((s) => s.updateAppointmentStatus);
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  if (!user || user.role !== 'doctor') return null;

  const myAppointments = appointments.filter((app) => app.doctorId === user.id);
  
  const filteredAppointments = myAppointments.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointments</h1>
        <p className="text-gray-600">Review and manage your patient appointments.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-6 overflow-x-auto">
        {(['pending', 'accepted', 'rejected', 'all'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab === 'all' ? 'All Appointments' : `${tab} Requests`}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 italic">
          No appointments found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div key={app.id} className="border border-gray-100 bg-white shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
                      <User size={20} className="text-blue-500" />
                      {app.patientName} 
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="text-sm text-gray-500 font-medium ml-7">
                    ID: {app.patientId} • Serial: <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{app.serialNumber || 'N/A'}</span>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'accepted')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'rejected')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 ml-7">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar size={16} className="text-gray-400" /> <span className="font-medium">{app.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock size={16} className="text-gray-400" /> <span className="font-medium">{app.time}</span>
                </div>
              </div>

              <div className="text-sm text-gray-700 bg-gray-50/50 p-4 rounded-lg border border-gray-100 ml-7">
                <span className="font-semibold block mb-1 text-gray-500 text-xs uppercase tracking-wider">Symptoms / Reason</span> 
                {app.symptoms}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
