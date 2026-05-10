import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { usePrescriptionStore } from "../../store/usePrescriptionStore";
import type { Prescription } from "../../store/usePrescriptionStore";
import { Pill, CheckCircle, Clock } from "lucide-react";

export default function MedicineDispense() {
  const prescriptions = usePrescriptionStore((s) => s.prescriptions);
  const updateStatus = usePrescriptionStore((s) => s.updatePrescriptionStatus);

  const [activeTab, setActiveTab] = useState<"pending" | "dispensed">("pending");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const pendingList = prescriptions.filter(p => p.status === "pending" || !p.status);
  const dispensedList = prescriptions.filter(p => p.status === "dispensed");

  const currentList = activeTab === "pending" ? pendingList : dispensedList;

  const handleDispense = () => {
    if (!selectedPrescription) return;
    updateStatus(selectedPrescription.id, "dispensed");
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
                        <h3 className="font-bold text-gray-800">Student ID: {p.patientId}</h3>
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
          <Card className="h-full overflow-y-auto flex flex-col">
            {selectedPrescription ? (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Prescription Details</h2>
                      <p className="text-sm text-gray-500">ID: {selectedPrescription.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedPrescription.status === "dispensed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {selectedPrescription.status || "pending"}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-gray-500 font-medium">Patient ID</p>
                      <p className="font-bold">{selectedPrescription.patientId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Doctor</p>
                      <p className="font-bold">{selectedPrescription.doctorName}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">Diagnosis / Notes</p>
                      <p className="text-gray-800">{selectedPrescription.problem || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Pill size={18} className="text-blue-600" /> Required Medicines
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedPrescription.medicines.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                        <div>
                          <p className="font-bold text-gray-800 text-base">{m.name}</p>
                          <p className="text-sm text-blue-600 font-medium">{m.dosage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-700">For {m.days} days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {activeTab === "pending" && (
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
                      onClick={handleDispense}
                    >
                      <CheckCircle size={20} className="inline mr-2" /> Mark as Dispensed
                    </Button>
                  </div>
                )}
              </>
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
