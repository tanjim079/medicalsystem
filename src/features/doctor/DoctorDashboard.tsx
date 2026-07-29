import { useNavigate } from "react-router-dom";
import DoctorOverview from "./DoctorOverview";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const handleSelectPatient = (id: string) => {
    // Navigate to consultancy tab with the selected patient ID
    navigate(`/doctor/consultancy?patientId=${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard Overview</h1>
      <DoctorOverview onSelectPatient={handleSelectPatient} />
    </div>
  );
}