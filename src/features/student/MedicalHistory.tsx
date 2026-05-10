import Card from "../../components/ui/Card";
import { Clock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import { Link } from "react-router-dom";

export default function MedicalHistory() {
  const user = useAuthStore((s) => s.user);
  const getPrescriptionsByPatient = usePrescriptionStore((s) => s.getPrescriptionsByPatient);

  // Fetch actual prescriptions for the logged-in student
  const history = user ? getPrescriptionsByPatient(user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-blue-500" size={20} />
        <h2 className="text-lg font-semibold">Recent Medical History</h2>
      </div>

      <div className="space-y-4">
        {history.map((h) => (
          <div key={h.id} className="border-b last:border-0 pb-3 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <p className="font-medium text-gray-800">{h.problem || "General Checkup"}</p>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {new Date(h.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {h.medicines.length > 0
                ? `Prescribed: ${h.medicines.map((m) => m.name).join(", ")}`
                : "No medicines prescribed"}
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-600 font-medium">Consulted: {h.doctorName}</p>
              <Link
                to={`/prescription/view/${h.id}`}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                View & Download
              </Link>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No recent history found.</p>
        )}
      </div>
    </Card>
  );
}
