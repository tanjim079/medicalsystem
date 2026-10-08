import { useEffect } from "react";
import { Clock, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import { Link } from "react-router-dom";

export default function MedicalHistory() {
  const user = useAuthStore((s) => s.user);
  const getPrescriptionsByPatient = usePrescriptionStore((s) => s.getPrescriptionsByPatient);
  const fetchPrescriptions = usePrescriptionStore((s) => s.fetchPrescriptions);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // Fetch actual prescriptions for the logged-in student
  const history = user ? getPrescriptionsByPatient(user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Clock size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Recent Medical History</h2>
      </div>

      <div className="space-y-6">
        {history.map((h, index) => (
          <div key={h.id} className="relative pl-6">
            {/* Timeline line */}
            {index !== history.length - 1 && (
              <div className="absolute top-8 bottom-[-24px] left-[11px] w-px bg-gray-200"></div>
            )}
            {/* Timeline dot */}
            <div className="absolute top-2 left-0 w-[23px] h-[23px] bg-blue-50 border-4 border-white rounded-full shadow-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <p className="font-bold text-gray-800 text-lg">{h.problem || "General Checkup"}</p>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {new Date(h.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="mb-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider text-xs mb-1">Prescribed Medicines</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {h.medicines && h.medicines.length > 0
                      ? h.medicines.map((m) => m.name).join(" • ")
                      : "No medicines prescribed"}
                  </p>
                </div>
                {h.tests && h.tests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider text-xs mb-1">Prescribed Lab Tests</p>
                    <div className="flex flex-wrap gap-2">
                      {h.tests.map((t) => (
                        <span key={t.id} className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap justify-between items-center gap-4 mt-2 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 p-1 rounded text-gray-600">
                    <User size={14} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{h.doctorName}</p>
                </div>
                <Link
                  to={`/prescription/view/${h.id}`}
                  className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                >
                  View & Download
                </Link>
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-10 px-4">
            <Clock className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 font-medium">No recent history found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

