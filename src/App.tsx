import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./features/home/HomePage";
import PublicDoctorsPage from "./features/doctor/PublicDoctorsPage";
import PublicStaffPage from "./features/staff/PublicStaffPage";
import PublicTestsPage from "./features/tests/PublicTestsPage";
import StudentDashboard from "./features/student/StudentDashboard";
import DoctorDashboard from "./features/doctor/DoctorDashboard";
import ReceptionistDashboard from "./features/receptionist/ReceptionistDashboard";
import PatientManagement from "./features/receptionist/PatientManagement";
import AppointmentManagement from "./features/receptionist/AppointmentManagement";
import TestBilling from "./features/receptionist/TestBilling";
import MedicineDispense from "./features/receptionist/MedicineDispense";
import PrescriptionPage from "./pages/PrescriptionPage";
import ViewPrescriptionPage from "./pages/ViewPrescriptionPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./features/admin/AdminDashboard";
import MedicinesPage from "./features/admin/medicines/MedicinesPage";
import DoctorsPage from "./features/admin/doctors/DoctorsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/doctors" element={<PublicLayout><PublicDoctorsPage /></PublicLayout>} />
        <Route path="/staff" element={<PublicLayout><PublicStaffPage /></PublicLayout>} />
        <Route path="/tests" element={<PublicLayout><PublicTestsPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
        
        {/* Protected Dashboard Routes (No public layout for these) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/patients" element={<PatientManagement />} />
        <Route path="/receptionist/appointments" element={<AppointmentManagement />} />
        <Route path="/receptionist/billing" element={<TestBilling />} />
        <Route path="/receptionist/pharmacy" element={<MedicineDispense />} />
        <Route path="/prescription/:id" element={<PrescriptionPage />} />
        <Route path="/prescription/view/:prescriptionId" element={<ViewPrescriptionPage />} />
        <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="medicines" element={<MedicinesPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
      </Route>
      </Routes>

      
    </HashRouter>
  );
}

export default App;