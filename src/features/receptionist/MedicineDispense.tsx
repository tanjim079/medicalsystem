import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import type { Prescription } from "../../store/usePrescriptionStore";
import { Pill, CheckCircle, Clock, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicineDispense() {
  const prescriptions = usePrescriptionStore((s) => s.prescriptions);
  const updateStatus = usePrescriptionStore((s) => s.updatePrescriptionStatus);
  const fetchPrescriptions = usePrescriptionStore((s: any) => s.fetchPrescriptions);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchPrescriptions) {
        fetchPrescriptions();
    }
  }, [fetchPrescriptions]);

  const [activeTab, setActiveTab] = useState<"pending" | "dispensed">("pending");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const pendingList = prescriptions.filter(p => p.status === "pending" || !p.status);
  const dispensedList = prescriptions.filter(p => p.status === "dispensed");

  const currentList = activeTab === "pending" ? pendingList : dispensedList;

  const [patient, setPatient] = useState<any | null>(null);

  useEffect(() => {
    if (selectedPrescription?.patientId) {
      const fetchPatient = async () => {
          try {
              const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const response = await fetch(`${apiUrl}/patients/${selectedPrescription.patientId}`);
              if (response.ok) {
                  const data = await response.json();
                  setPatient({
                      id: data.id,
                      universityId: data.roll_number || "N/A",
                      name: data.name,
                      age: data.age || "N/A",
                  });
              }
          } catch (err) {
              console.error("Failed to fetch patient", err);
          }
      };
      fetchPatient();
    } else {
      setPatient(null);
    }
  }, [selectedPrescription?.patientId]);

  const handleDispense = async () => {
    if (!selectedPrescription) return;
    await updateStatus(selectedPrescription.id, "dispensed");
    alert("Medicines marked as dispensed successfully!");
    setSelectedPrescription(null);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy & Dispensing</h1>
          <p className="text-gray-600">Manage and issue prescribed medicines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Queue */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-140px)]">
          <Card className="flex-1 flex flex-col overflow-hidden p-0">
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === "pending" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Clock size={16} /> Pending ({pendingList.length})
              </button>
              <button 
                onClick={() => setActiveTab("dispensed")}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === "dispensed" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <CheckCircle size={16} /> Dispensed ({dispensedList.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentList.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  <Pill size={40} className="mx-auto mb-2 opacity-30" />
                  <p>No {activeTab} prescriptions found.</p>
                </div>
              ) : (
                currentList.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPrescription(p)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPrescription?.id === p.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">ID No.: {p.patientId}</h3>
                        <p className="text-xs text-gray-500">Dr. {p.doctorName}</p>
                      </div>
                      <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{p.medicines.length} medicines prescribed</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: Details */}
        <div className="lg:col-span-7 h-[calc(100vh-140px)]">
          <Card className="h-full overflow-hidden flex flex-col p-0 bg-gray-50/50">
            {selectedPrescription ? (
              <div className="flex-1 flex flex-col relative h-full">
                <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-20">
                  <h2 className="text-lg font-bold text-gray-800">Prescription Preview</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedPrescription.status === "dispensed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {selectedPrescription.status || "pending"}
                  </span>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Exact Prescription View */}
                    <div className="bg-white p-8 rounded-sm shadow-md text-sm relative border border-gray-200">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
                            <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="Watermark" className="w-2/3 max-w-[500px] object-contain" />
                        </div>

                        {/* Content Wrapper */}
                        <div className="relative z-10 flex flex-col h-full min-h-[600px]">
                            {/* Header */}
                            <div className="grid grid-cols-[auto_1fr_auto] items-center border-b-2 border-blue-800 pb-4 mb-6">
                                <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET Logo" className="w-16 h-16 object-contain" />
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-blue-900 uppercase tracking-wide">RUET Health Complex</h2>
                                    <p className="text-xs text-gray-700 font-medium">Rajshahi University of Engineering & Technology</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Kazla, Rajshahi-6204, Bangladesh</p>
                                </div>
                                <div className="w-16"></div> {/* Spacer */}
                            </div>

                            {/* Patient Info */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-gray-200 pb-4 mb-6">
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-20">Patient Name:</span>
                                    <span className="font-semibold text-gray-800">{patient?.name || "Unknown"}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-20">Date:</span>
                                    <span className="font-semibold text-gray-800">{new Date(selectedPrescription.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-20">ID No.:</span>
                                    <span className="font-semibold text-gray-800">{selectedPrescription.patientId}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-20">Age:</span>
                                    <span className="font-semibold text-gray-800">{patient?.age || "N/A"} Years</span>
                                </div>
                            </div>

                            {/* Problem */}
                            <div className="mb-6">
                                <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                    <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-4 h-4 mr-2 opacity-80" alt="Logo" />
                                    <h3 className="text-sm font-semibold text-blue-900">Clinical Diagnosis</h3>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded-md text-gray-700 min-h-[40px] text-xs">
                                    {selectedPrescription.problem || "No diagnosis recorded."}
                                </div>
                            </div>

                            {/* Rx Symbol */}
                            <div className="mb-4 flex items-center">
                                <span className="text-3xl font-serif font-bold text-blue-900">℞</span>
                            </div>

                            {/* Medicines */}
                            <div className={`space-y-3 ${selectedPrescription.medicines.length > 0 ? 'min-h-[100px]' : ''}`}>
                                {selectedPrescription.medicines.length === 0 && (!selectedPrescription.tests || selectedPrescription.tests.length === 0) && !selectedPrescription.advice ? (
                                    <p className="text-gray-400 italic text-center mt-10 text-xs">No medicines prescribed</p>
                                ) : (
                                    selectedPrescription.medicines.map((m, i) => (
                                        <div key={i} className="flex justify-between items-start mb-3 group">
                                            <div className="flex gap-2">
                                                <span className="font-bold text-gray-800 text-sm">{i + 1}.</span>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{m.name}</div>
                                                    <div className="text-xs text-gray-600 mt-1 flex items-center">
                                                        <span className="font-semibold px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-blue-900">{m.dosage}</span>
                                                        <span className="mx-2 text-gray-400">—</span>
                                                        <span className="text-gray-600 font-medium">{m.days} days</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Diagnostic Tests */}
                            {selectedPrescription.tests && selectedPrescription.tests.length > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-3 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-4 h-4 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="text-sm font-semibold text-blue-900">Recommended Tests</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pl-2">
                                        {selectedPrescription.tests.map((t) => (
                                            <div key={t.id} className="text-xs text-gray-800 flex items-start">
                                                <span className="text-blue-600 mr-2 font-bold">•</span> 
                                                <span className="leading-snug">{t.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Advice */}
                            {selectedPrescription.advice && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-4 h-4 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="text-sm font-semibold text-blue-900">Doctor's Advice / Suggestions</h3>
                                    </div>
                                    <div className="text-gray-700 text-xs whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                                        {selectedPrescription.advice}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-16 flex-grow flex flex-col justify-end">
                                {/* Signatures */}
                                <div className="flex justify-between items-end pb-4">
                                    <div className="text-center w-32">
                                        <div className="border-t border-gray-800 w-full mb-1"></div>
                                        <p className="text-xs text-gray-800 font-semibold">Patient Signature</p>
                                    </div>

                                    <div className="text-center w-40">
                                        <div className="border-t border-gray-800 w-full mb-1"></div>
                                        <p className="font-bold text-gray-800 text-sm">{selectedPrescription.doctorName}</p>
                                        <p className="text-[10px] text-gray-600 font-medium capitalize">
                                            Medical Officer
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-3 border-t border-gray-300 text-center">
                                    <p className="text-[10px] text-gray-600">
                                        <span className="font-bold text-blue-900">RUET Health Complex</span> | Rajshahi University of Engineering & Technology
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">This prescription is electronically generated by RUET Health Complex.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {(activeTab === "pending" || (selectedPrescription.tests && selectedPrescription.tests.length > 0)) && (
                  <div className="p-4 border-t bg-white sticky bottom-0 z-20 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {selectedPrescription.tests && selectedPrescription.tests.length > 0 && (
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg shadow"
                        onClick={() => navigate("/receptionist/billing", { state: { patientId: selectedPrescription.patientId, tests: selectedPrescription.tests } })}
                      >
                        <Receipt size={20} className="inline mr-2" /> Auto-Generate Test Bill
                      </Button>
                    )}

                    {activeTab === "pending" && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg shadow"
                        onClick={handleDispense}
                      >
                        <CheckCircle size={20} className="inline mr-2" /> Mark as Dispensed
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Pill size={48} className="mb-4 opacity-20" />
                <p>Select a prescription from the queue to view details.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
