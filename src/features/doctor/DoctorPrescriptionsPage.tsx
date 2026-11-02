import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import Card from "../../components/ui/Card";
import {
  FileText,
  Search,
  ExternalLink,
  Calendar,
  User,
  Plus,
  CheckCircle2,
  Clock,
  Pill,
} from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const prescriptions = usePrescriptionStore((s) => s.prescriptions);
  const fetchPrescriptions = usePrescriptionStore((s) => s.fetchPrescriptions);
  const loading = usePrescriptionStore((s) => s.loading);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  if (!user || user.role !== "doctor") return null;

  // Filter for prescriptions written by this doctor
  const myPrescriptions = prescriptions
    .filter((p) => p.doctorId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredPrescriptions = myPrescriptions.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.patientName.toLowerCase().includes(term) ||
      p.patientId.toLowerCase().includes(term) ||
      (p.problem && p.problem.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Prescription Records</h1>
          <p className="text-slate-500 text-sm mt-1">
            History of medical prescriptions issued by you.
          </p>
        </div>

        <button
          onClick={() => navigate("/doctor/consultancy")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition active:scale-95"
        >
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient name, student ID, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </Card>

      {/* Prescriptions List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
          <p className="text-sm font-medium">Loading prescriptions...</p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
          <FileText className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold text-slate-700">No prescriptions found.</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? "Try adjusting your search query." : "Issued prescriptions will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrescriptions.map((rx) => {
            const formattedDate = rx.date
              ? new Date(rx.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            const medicineCount = rx.medicines?.length || 0;
            const testCount = rx.tests?.length || 0;

            return (
              <Card
                key={rx.id}
                className="hover:border-blue-200 hover:shadow-md transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <User size={16} className="text-blue-500" />
                      {rx.patientName}
                    </span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      ID: {rx.patientId}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        rx.status === "dispensed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {rx.status === "dispensed" ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-600" /> Dispensed
                        </>
                      ) : (
                        <>
                          <Clock size={12} className="text-amber-600" /> Pending Dispense
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-medium truncate">
                    Diagnosis: <span className="text-slate-900">{rx.problem || "General Advice"}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Pill size={13} className="text-indigo-400" />
                      {medicineCount} Medicine{medicineCount !== 1 ? "s" : ""}
                    </span>
                    {testCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{testCount} Lab Test{testCount !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/prescription/view/${rx.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <ExternalLink size={14} /> View / Print Rx
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
