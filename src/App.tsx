import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./features/home/HomePage";
import PublicServicesPage from "./features/services/PublicServicesPage";
import PublicDoctorsPage from "./features/doctor/PublicDoctorsPage";
import PublicStaffPage from "./features/staff/PublicStaffPage";
import PublicTestsPage from "./features/tests/PublicTestsPage";
import StudentDashboard from "./features/student/StudentDashboard";
import TeacherDashboard from "./features/teacher/TeacherDashboard";
import DoctorDashboard from "./features/doctor/DoctorDashboard";

import TestBilling from "./features/receptionist/TestBilling";
import BillingHistory from "./features/receptionist/BillingHistory";
import MedicineDispense from "./features/receptionist/MedicineDispense";
import ReportClearance from "./features/receptionist/ReportClearance";
import PrescriptionPage from "./pages/PrescriptionPage";
import ViewPrescriptionPage from "./pages/ViewPrescriptionPage";
import CreateCertificatePage from "./pages/CreateCertificatePage";
import ViewCertificatePage from "./pages/ViewCertificatePage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./features/admin/AdminDashboard";
import UsersPage from "./features/admin/users/UsersPage";
import MedicinesPage from "./features/admin/medicines/MedicinesPage";
import DoctorsPage from "./features/admin/doctors/DoctorsPage";
import DoctorLayout from "./layouts/DoctorLayout";
import AppointmentsPage from "./features/doctor/AppointmentsPage";
import ConsultancyPage from "./features/doctor/ConsultancyPage";
import ScrollToTop from "./components/ScrollToTop";
import PathologistLayout from "./layouts/PathologistLayout";
import PathologistDashboard from "./features/pathologist/PathologistDashboard";
import TestManagement from "./features/pathologist/TestManagement";
import TestDetails from "./features/pathologist/TestDetails";
import ReportView from "./features/pathologist/ReportView";
import PathologistProfile from "./features/pathologist/PathologistProfile";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><PublicServicesPage /></PublicLayout>} />
        <Route path="/doctors" element={<PublicLayout><PublicDoctorsPage /></PublicLayout>} />
        <Route path="/staff" element={<PublicLayout><PublicStaffPage /></PublicLayout>} />
        <Route path="/tests" element={<PublicLayout><PublicTestsPage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />

        {/* Protected Dashboard Routes (No public layout for these) */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/receptionist" element={<Navigate to="/receptionist/billing" replace />} />


        <Route path="/receptionist/billing" element={<TestBilling />} />
        <Route path="/receptionist/billing-history" element={<BillingHistory />} />
        <Route path="/receptionist/pharmacy" element={<MedicineDispense />} />
        <Route path="/receptionist/reports" element={<ReportClearance />} />
        <Route path="/prescription/:id" element={<PrescriptionPage />} />
        <Route path="/prescription/view/:prescriptionId" element={<ViewPrescriptionPage />} />
        <Route path="/certificate/create/:patientId" element={<CreateCertificatePage />} />
        <Route path="/certificate/view/:certificateId" element={<ViewCertificatePage />} />
        <Route path="/reports/view/:id" element={<ReportView />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
        </Route>

        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="consultancy" element={<ConsultancyPage />} />
        </Route>

        {/* Pathologist Routes */}
        <Route path="/pathologist" element={<PathologistLayout />}>
          <Route path="dashboard" element={<PathologistDashboard />} />
          <Route path="tests" element={<TestManagement />} />
          <Route path="tests/:id" element={<TestDetails />} />
          <Route path="reports" element={<TestManagement />} />
          <Route path="profile" element={<PathologistProfile />} />
        </Route>
      </Routes>


    </BrowserRouter>
  );
}

export default App;

