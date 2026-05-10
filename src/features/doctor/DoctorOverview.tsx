import { Calendar, Users, FileText, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import Card from "../../components/ui/Card";

interface Props {
  onSelectPatient: (patientId: string) => void;
}

export default function DoctorOverview({ onSelectPatient }: Props) {
  const user = useAuthStore((s) => s.user);
  const appointments = useAppointmentStore((s) => s.appointments);
  const prescriptions = usePrescriptionStore((s) => s.prescriptions);

  // Filter for today's data relevant to this doctor
  const myAppointments = appointments.filter(a => a.doctorId === user?.id);
  const pendingRequests = myAppointments.filter(a => a.status === 'pending');
  const upcomingAppointments = myAppointments.filter(a => a.status === 'accepted' || a.status === 'pending');
  
  const myPrescriptions = prescriptions.filter(p => p.doctorId === user?.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. {user?.name?.split(' ')[user.name.split(' ').length - 1] || 'Doctor'}!</h2>
          <p className="text-blue-100 max-w-lg">
            You have {pendingRequests.length} pending appointment requests and {upcomingAppointments.length} total scheduled consultations today.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">My Patients</p>
            <h3 className="text-2xl font-bold text-gray-800">{new Set(myAppointments.map(a => a.patientId)).size}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 p-4 rounded-lg text-orange-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-800">{pendingRequests.length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-4 rounded-lg text-green-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Prescriptions Written</p>
            <h3 className="text-2xl font-bold text-gray-800">{myPrescriptions.length}</h3>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments Table */}
      <Card>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold text-gray-800">Your Upcoming Appointments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-sm text-gray-600">
                <th className="p-3 font-semibold">Token</th>
                <th className="p-3 font-semibold">Patient</th>
                <th className="p-3 font-semibold">Date & Time</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {app.tokenNumber || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-gray-800">{app.patientName}</td>
                    <td className="p-3 text-gray-600 text-sm">{app.date} at {app.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                        ${app.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => onSelectPatient(app.patientId)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                      >
                        Consult <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-500 italic">
                    No upcoming appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
