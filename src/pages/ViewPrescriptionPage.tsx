import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useRef } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { mockPatients } from "../data/mockPatients";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePrescriptionStore } from "../store/usePrescriptionStore";

export default function ViewPrescriptionPage() {
    const { prescriptionId } = useParams();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);

    const prescriptions = usePrescriptionStore((s) => s.prescriptions);
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    
    // Find patient data based on patientId in the prescription
    const patient = mockPatients.find((p) => p.universityId.toLowerCase() === prescription?.patientId.toLowerCase());

    // 🖨 Print
    const handlePrint = () => {
        window.print();
    };

    // 📄 PDF Download
    const handleDownload = async () => {
        if (!printRef.current) return;

        const canvas = await html2canvas(printRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save(`prescription-${prescriptionId}.pdf`);
    };

    if (!prescription) {
        return (
            <MainLayout>
                <div className="text-center mt-20">
                    <h2 className="text-2xl font-bold text-gray-800">Prescription Not Found</h2>
                    <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                    ← Back
                </button>

                <Card>
                    <div
                        ref={printRef}
                        className="print-area bg-white p-6 rounded text-sm"
                    >
                        {/* Header */}
                        <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-blue-800 uppercase tracking-wide">RUET Medical Center</h2>
                            <p className="text-sm text-gray-600 font-medium">Rajshahi University of Engineering & Technology</p>
                            <p className="text-xs text-gray-500">Kazla, Rajshahi-6204, Bangladesh</p>
                        </div>

                        {/* Patient Info */}
                        <div className="grid grid-cols-2 gap-y-2 text-sm border-b pb-4 mb-6">
                            <div>
                                <p><span className="text-gray-500 font-medium">Patient Name:</span> <span className="font-semibold text-gray-800">{patient?.name || "Unknown"}</span></p>
                            </div>
                            <div className="text-right">
                                <p><span className="text-gray-500 font-medium">Date:</span> <span className="font-semibold text-gray-800">{new Date(prescription.date).toLocaleDateString()}</span></p>
                            </div>
                            <div>
                                <p><span className="text-gray-500 font-medium">Student ID:</span> <span className="font-semibold text-gray-800">{prescription.patientId}</span></p>
                            </div>
                            <div className="text-right">
                                <p><span className="text-gray-500 font-medium">Age:</span> <span className="font-semibold text-gray-800">{patient?.age || "N/A"} Years</span></p>
                            </div>
                        </div>

                        {/* Problem */}
                        <div className="mb-6">
                            <p className="font-semibold text-blue-800 mb-2 border-b border-gray-100 pb-1">Clinical Diagnosis:</p>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-700 min-h-[60px] italic">
                                {prescription.problem || "No diagnosis recorded."}
                            </p>
                        </div>

                        {/* Rx Symbol */}
                        <div className="mb-4 text-4xl font-serif font-bold text-blue-800">℞</div>

                        {/* Medicines */}
                        <div className="space-y-4 min-h-[200px]">
                            {prescription.medicines.length === 0 ? (
                                <p className="text-gray-400 italic text-center mt-10">No medicines prescribed</p>
                            ) : (
                                prescription.medicines.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2">
                                        <div>
                                            <span className="font-bold text-gray-800 text-base">
                                                {i + 1}. {m.name}
                                            </span>
                                        </div>
                                        <div className="text-right text-sm">
                                            <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-1 rounded">{m.dosage}</span>
                                            <span className="text-gray-500 ml-3">× {m.days} days</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-16 flex justify-between items-end pt-6 border-t border-gray-200">
                            <div className="text-left">
                                <div className="border-t border-gray-400 w-40 mb-1"></div>
                                <p className="text-xs text-gray-500 font-medium text-center">Patient Signature</p>
                            </div>

                            <div className="text-right">
                                <div className="border-t border-gray-400 w-48 mb-1"></div>
                                <p className="font-bold text-gray-800 text-center">{prescription.doctorName}</p>
                                <p className="text-xs text-blue-600 font-medium text-center capitalize">
                                    Medical Officer
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6 justify-center border-t pt-4">
                        <Button onClick={handlePrint}>
                            Print Prescription
                        </Button>

                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                            Download PDF
                        </Button>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
}
