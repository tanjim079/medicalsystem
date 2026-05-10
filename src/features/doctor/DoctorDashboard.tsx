import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import PatientDetails from "./PatientDetails";
import TreatmentHistory from "./TreatmentHistory";
import DoctorHeader from "./DoctorHeader";
import RightPanel from "./RightPanel";
import AppointmentRequests from "./AppointmentRequests";
import DoctorOverview from "./DoctorOverview";
import { mockPatients } from "../../data/mockPatients";
import type { Patient } from "../../data/mockPatients";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();
  const handleSearch = (id: string) => {
    const found = mockPatients.find(
      (p) => p.universityId.toLowerCase() === id.toLowerCase()
    );

    if (!found) {
      alert("Patient not found");
      return;
    }

    setSelectedPatient(found);
  };
  const handlePrescription = () => {
    if (!selectedPatient) {
      alert("Select a patient first");
      return;
    }

    navigate(`/prescription/${selectedPatient.universityId}`);
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>

      <DoctorHeader onSearch={handleSearch} />

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 min-h-[80vh]">
        {!selectedPatient ? (
          <div className="lg:col-span-5">
            <DoctorOverview onSelectPatient={handleSearch} />
          </div>
        ) : (
          <>
            {/* CENTER */}
            <div className="lg:col-span-3 space-y-4">
              <PatientDetails patient={selectedPatient} />
              <TreatmentHistory patient={selectedPatient} />

              <button
                onClick={handlePrescription}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Prescription
              </button>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-4">
              <AppointmentRequests />
              <RightPanel patient={selectedPatient} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}