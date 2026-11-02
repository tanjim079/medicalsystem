import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, FileText, ArrowRight, AlertCircle, Clock, CheckCircle } from "lucide-react";
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
  const fetchAppointments = useAppointmentStore((s) => s.fetchAppointments);
  const appointmentsLoading = useAppointmentStore((s) => s.loading);

  const prescriptions = usePrescriptionStore((s) => s.prescriptions);
  const fetchPrescriptions = usePrescriptionStore((s) => s.fetchPrescriptions);
  const prescriptionsLoading = usePrescriptionStore((s) => s.loading);

  // Fetch doctor data on mount
  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
  }, [fetchAppointments, fetchPrescriptions]);

  // Safe doctor display name
  const doctorNameParts = user?.name ? user.name.trim().split(/\s+/) : [];
  const doctorLastName = doctorNameParts.length > 0 ? doctorNameParts[doctorNameParts.length - 1] : "Doctor";

  // Filter appointments for this doctor
  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const pendingRequests = myAppointments.filter((a) => a.status === "pending");

  // Today's date in local YYYY-MM-DD
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const todayScheduled = myAppointments.filter(
    (a) => a.status === "accepted" && a.date === todayDate
  );

  // Filter prescriptions for this doctor
  const myPrescriptions = prescriptions.filter((p) => p.doctorId === user?.id);

  // Distinct patient count from both appointments and prescriptions
  const uniquePatients = new Set([
    ...myAppointments.map((a) => a.patientUniversityId || a.patientId).filter(Boolean),
    ...myPrescriptions.map((p) => p.patientId).filter(Boolean),
  ]);

  // Upcoming appointments (accepted, sorted chronologically from today onward)
  const upcomingAppointments = myAppointments
    .filter((a) => a.status === "accepted" && a.date >= todayDate)
    .sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return cmp;
      return (a.time || "").localeCompare(b.time || "");
    });

  const isLoading = appointmentsLoading && prescriptionsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
            Welcome back, Dr. {doctorLastName}!
          </h2>
          <p className="text-blue-100 max-w-xl text-base leading-relaxed">
            You have <strong className="text-white underline decoration-blue-300">{pendingRequests.length} pending</strong> appointment request{pendingRequests.length === 1 ? "" : "s"} and{" "}
            <strong className="text-white underline decoration-blue-300">{todayScheduled.length} consultation{todayScheduled.length === 1 ? "" : "s"}</strong> scheduled for today ({todayDate}).
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
      </div>

      {/* Pending Notification Alert */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 text-amber-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">
                You have {pendingRequests.length} pending appointment review{pendingRequests.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700">
                Review and accept or decline time slots to update patient booking status.
              </p>
            </div>
          </div>
          <Link
            to="/doctor/appointments"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
          >
            Review Requests <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Patients */}
        <Card className="flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600 flex-shrink-0">
            <Users size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500 font-medium">My Total Patients</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? "..." : uniquePatients.size}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Consulted & booked</p>
          </div>
        </Card>

        {/* Pending Requests */}
        <Link to="/doctor/appointments" className="block group">
          <Card className="flex items-center gap-4 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer h-full">
            <div className="bg-orange-100 group-hover:bg-orange-200 p-4 rounded-xl text-orange-600 flex-shrink-0 transition-colors">
              <Calendar size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {isLoading ? "..." : pendingRequests.length}
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-0.5">Awaiting your response</p>
            </div>
          </Card>
        </Link>

        {/* Prescriptions Written */}
        <Link to="/doctor/prescriptions" className="block group">
          <Card className="flex items-center gap-4 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer h-full">
            <div className="bg-emerald-100 group-hover:bg-emerald-200 p-4 rounded-xl text-emerald-600 flex-shrink-0 transition-colors">
              <FileText size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">Prescriptions Written</p>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {isLoading ? "..." : myPrescriptions.length}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">View prescription history</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Upcoming Appointments Table */}
      <Card>
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Your Upcoming Consultations</h3>
            <p className="text-xs text-gray-500">Confirmed patient appointments scheduled from today onward</p>
          </div>
          <Link
            to="/doctor/appointments"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Manage All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50/80 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="p-3">Serial</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 5).map((app) => {
                  const displayPatientId = app.patientUniversityId || app.patientId;
                  const isToday = app.date === todayDate;

                  return (
                    <tr key={app.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs border border-blue-100">
                          {app.serialNumber || "N/A"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900 text-sm">{app.patientName}</div>
                      </td>
                      <td className="p-3 text-xs text-gray-600 font-medium font-mono">
                        {displayPatientId}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-gray-400" />
                          <span className={isToday ? "font-bold text-blue-700" : ""}>
                            {app.date} at {app.time}
                          </span>
                          {isToday && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={12} className="text-emerald-600" /> Confirmed
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectPatient(displayPatientId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm active:scale-95"
                        >
                          Consult <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 italic">
                    {isLoading ? "Loading appointments..." : "No upcoming scheduled appointments found."}
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
