import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import TreatmentHistory from "./TreatmentHistory";
import DoctorHeader from "./DoctorHeader";
import RightPanel from "./RightPanel";
import { mockPatients, type Patient } from "../../data/mockPatients";

export default function ConsultancyPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (patientId) {
      handleSearch(patientId);
    }
  }, [searchParams]);

  const handleSearch = (id: string) => {
    const found = mockPatients.find(
      (p) => p.universityId.toLowerCase() === id.toLowerCase() || p.id.toLowerCase() === id.toLowerCase()
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Consultancy</h1>
      <DoctorHeader onSearch={handleSearch} />

      <div className="mt-6 flex flex-col lg:grid lg:grid-cols-5 gap-4">
        {!selectedPatient ? (
          <div className="lg:col-span-5 text-center p-12 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
            Please search for a patient by ID to begin consultancy.
          </div>
        ) : (
          <>
            {/* CENTER */}
            <div className="lg:col-span-3 space-y-4">
              <PatientDetails patient={selectedPatient} />
              <TreatmentHistory patient={selectedPatient} />

              <button
                onClick={handlePrescription}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Prescription
              </button>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-4">
              <RightPanel patient={selectedPatient} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
