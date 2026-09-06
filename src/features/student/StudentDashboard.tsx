import MainLayout from "../../layouts/MainLayout";
import StudentProfile from "./StudentProfile";
import MedicalHistory from "./MedicalHistory";
import LaboratoryReports from "./LaboratoryReports";
import MedicalCertificates from "./MedicalCertificates";
import AppointmentsList from "./AppointmentsList";
import { useAuthStore } from "../../store/useAuthStore";
import { mockPatients } from "../../data/mockPatients";
import Card from "../../components/ui/Card";
import { Info } from "lucide-react";
import { siteSettings } from "../../config/siteSettings";

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  // Find the patient matching the logged-in student's ID
  const patientData = mockPatients.find(
    (p) => p.universityId.toLowerCase() === user?.id.toLowerCase()
  );

  return (
    <MainLayout>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Student Dashboard</h1>
          <p className="text-blue-100 text-lg">
            Welcome back, <span className="font-semibold">{user?.name}</span>
          </p>
        </div>
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-32 -mb-8 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Profile and Info */}
        <div className="md:col-span-1 space-y-6">
          {patientData ? (
            <StudentProfile patient={patientData} />
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-4">
                Profile data not found in mock records.
              </p>
            </Card>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex items-center gap-3 mb-5">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Info size={20} />
              </div>
              <h2 className="font-bold text-gray-800 text-lg">Health Complex Info</h2>
            </div>
            
            <ul className="text-sm text-gray-600 space-y-4 relative z-10">
              <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="font-medium text-gray-700">Hours</span>
                <span className="text-gray-500">{siteSettings.serviceHours.workingDaysShort}: {siteSettings.serviceHours.time}</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="font-medium text-gray-700">{siteSettings.serviceHours.lunchBreakLabel}</span>
                <span className="text-gray-500">{siteSettings.serviceHours.lunchBreakTime}</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="font-medium text-red-500">{siteSettings.serviceHours.offDayLabel}</span>
                <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md font-medium text-xs">{siteSettings.serviceHours.offDayStatus}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Ambulance</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-xs">24 Hours</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Appointments, Medical History, Certificates */}
        <div className="md:col-span-2 space-y-6">
          <AppointmentsList />
          <MedicalHistory />
          <LaboratoryReports />
          <MedicalCertificates />
        </div>
      </div>
    </MainLayout>
  );
}
