import MainLayout from "../../layouts/MainLayout";
import StudentProfile from "./StudentProfile";
import MedicalHistory from "./MedicalHistory";
import AppointmentsList from "./AppointmentsList";
import { useAuthStore } from "../../store/useAuthStore";
import { mockPatients } from "../../data/mockPatients";
import Card from "../../components/ui/Card";
import { Info } from "lucide-react";

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  // Find the patient matching the logged-in student's ID
  const patientData = mockPatients.find(
    (p) => p.universityId.toLowerCase() === user?.id.toLowerCase()
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
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

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-blue-500" size={20} />
              <h2 className="font-semibold">Medical Center Info</h2>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <strong>Hours:</strong> Sat-Thu: 07:30 AM - 10:00 PM
              </li>
              <li>
                <strong>Lunch Break:</strong> 1:30 PM - 3:00 PM
              </li>
              <li>
                <strong className="text-red-500">Friday: Off Day</strong>
              </li>
              <li>
                <strong>Ambulance:</strong> 24 Hours
              </li>
            </ul>
          </Card>
        </div>

        {/* RIGHT COLUMN: Appointments and Medical History */}
        <div className="md:col-span-2 space-y-6">
          <AppointmentsList />
          <MedicalHistory />
        </div>
      </div>
    </MainLayout>
  );
}
