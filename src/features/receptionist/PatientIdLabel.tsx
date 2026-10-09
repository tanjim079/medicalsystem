
import { useState, useEffect } from "react";
import { fetchAuth } from "../../lib/fetchAuth";

export default function PatientIdLabel({ patientId }: { patientId: string }) {
  const [uniId, setUniId] = useState(patientId.substring(0, 8).toUpperCase());

  useEffect(() => {
    // If it already looks like a short ID, just use it
    if (!patientId.includes("-")) {
      setUniId(patientId);
      return;
    }
    const fetchPatient = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetchAuth(`${apiUrl}/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          const id = data.roll_number || data.employee_id || data.email || "N/A";
          if (id !== "N/A") setUniId(id);
        }
      } catch (e) {}
    };
    fetchPatient();
  }, [patientId]);

  return <>{uniId}</>;
}
