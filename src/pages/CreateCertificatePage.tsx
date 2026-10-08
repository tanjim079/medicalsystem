import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuthStore } from "../store/useAuthStore";
import { useCertificateStore } from "../store/useCertificateStore";
import Card from "../components/ui/Card";
import { FileText, Calendar, ArrowLeft } from "lucide-react";

export default function CreateCertificatePage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addCertificate = useCertificateStore((s) => s.addCertificate);

  const [patient, setPatient] = useState<any>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  const [diagnosis, setDiagnosis] = useState("");
  const [restStartDate, setRestStartDate] = useState("");
  const [restEndDate, setRestEndDate] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${API_URL}/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setPatient({
            ...data,
            universityId: data.employee_id || data.roll_number || data.email || "N/A"
          });
        }
      } catch (error) {
        console.error("Failed to fetch patient:", error);
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  const calculateDays = () => {
    if (restStartDate && restEndDate) {
      const start = new Date(restStartDate);
      const end = new Date(restEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patient || !user) {
      alert("Missing patient or user details");
      return;
    }

    if (!diagnosis || !restStartDate || !restEndDate) {
      alert("Please fill all required fields");
      return;
    }

    const cert = await addCertificate({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: user.id,
      doctorName: user.name,
      diagnosis,
      restStartDate,
      restEndDate,
      recommendedRestDays: calculateDays(),
      remarks,
    });

    if (cert) {
      alert("Certificate created successfully!");
      navigate("/doctor");
    } else {
      alert("Failed to create certificate.");
    }
  };

  if (loadingPatient) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-gray-500">Loading patient details...</div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout>
        <div className="text-center py-20 text-gray-500">Patient not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <Card>
          <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-sm">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issue Medical Certificate</h1>
              <p className="text-emerald-700 font-medium">For: {patient.name} ({patient.universityId})</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnosis / Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Viral Fever, Chicken Pox"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rest Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={restStartDate}
                    onChange={(e) => setRestStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rest End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={restEndDate}
                    onChange={(e) => setRestEndDate(e.target.value)}
                    min={restStartDate}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {restStartDate && restEndDate && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-2">
                <span className="font-semibold text-gray-700">Total Recommended Rest:</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                  {calculateDays()} days
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Remarks / Special Advice
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any additional remarks..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[100px] resize-none transition-all"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                Issue Certificate
              </button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
