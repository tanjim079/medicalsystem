import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PatientDetails from "./PatientDetails";

import DoctorHeader from "./DoctorHeader";
import RightPanel from "./RightPanel";
import type { Patient } from "../../types/patient";

interface ConsultancyPatient extends Patient {
  treatmentHistory?: unknown[];
  labReports?: unknown[];
  visitSummary?: {
    totalVisits: number;
    lastVisit: string | null;
  };
}

export default function ConsultancyPage() {
  const [selectedPatient, setSelectedPatient] = useState<ConsultancyPatient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (id: string) => {
    if (!id.trim()) return;
    setSearchParams({ patientId: id.trim() });
  };

  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (!patientId) {
      return;
    }

    let isMounted = true;
    const fetchPatient = async (id: string) => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        // Search the real backend!
        const response = await fetch(`${apiUrl}/patients/${id}?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error("Patient not found");
        }
        
        const data = await response.json();
        
        // Map backend data to frontend expected format
        const mappedPatient: ConsultancyPatient = {
          id: data.id,
          universityId: data.roll_number || "N/A",
          name: data.name,
          phone: data.phone || "N/A",
          age: data.age || "N/A",
          bloodGroup: data.blood_group || "N/A",
          guardianName: data.guardian_name || "N/A",
          guardianPhone: data.guardian_phone || "N/A",
          treatmentHistory: data.treatmentHistory || [],
          labReports: data.labReports || [],
          visitSummary: data.visitSummary || { totalVisits: 0, lastVisit: null }
        };

        if (isMounted) {
          setSelectedPatient(mappedPatient);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to fetch patient data";
          alert(message);
          setSelectedPatient(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPatient(patientId);

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const handlePrescription = () => {
    if (!selectedPatient) {
      alert("Select a patient first");
      return;
    }
    navigate(`/prescription/${selectedPatient.universityId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 w-2 h-8 rounded-full"></div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Consultancy</h1>
      </div>
      
      <DoctorHeader onSearch={handleSearch} />

      <div className="mt-8 flex flex-col lg:grid lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-20 bg-white border border-gray-200 shadow-sm rounded-2xl text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-medium text-gray-500">Searching for patient...</p>
          </div>
        ) : !selectedPatient ? (
          <div className="lg:col-span-5 text-center p-16 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Patient Selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">Please search for a patient by ID (e.g. 2204001) to view their profile, create prescriptions, or issue medical certificates.</p>
          </div>
        ) : (
          <>
            {/* CENTER */}
            <div className="lg:col-span-3 space-y-6">
              <PatientDetails patient={selectedPatient} />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={handlePrescription}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex-1 text-sm font-bold shadow-md flex justify-center items-center gap-2 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                  Prescription
                </button>
                <button
                  onClick={() => navigate(`/certificate/create/${selectedPatient.universityId}`)}
                  className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 flex-1 text-sm font-bold shadow-md flex justify-center items-center gap-2 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 15v5"></path><path d="M7 17.5l3-2.5 3 2.5"></path></svg>
                  Certificate
                </button>
              </div>
              <RightPanel patient={selectedPatient} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
