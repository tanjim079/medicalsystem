import { fetchAuth } from '../lib/fetchAuth';
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useRef, useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Loader2 } from "lucide-react";
import { downloadElementAsPdf } from "../lib/pdfDownloader";
import { usePrescriptionStore } from "../store/usePrescriptionStore";
import PatientIdLabel from "../features/receptionist/PatientIdLabel";

interface PatientInfo {
    id: string;
    universityId: string;
    name: string;
    age: number | string;
}

export default function ViewPrescriptionPage() {
    const { prescriptionId } = useParams();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const prescriptions = usePrescriptionStore((s) => s.prescriptions);
    const prescription = prescriptions.find(p => p.id === prescriptionId);

    const [patient, setPatient] = useState<PatientInfo | null>(null);

    useEffect(() => {
        if (prescription?.patientId) {
            const fetchPatient = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                    const response = await fetchAuth(`${apiUrl}/patients/${prescription.patientId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPatient({
                            id: data.id,
                            universityId: data.employee_id || data.roll_number || data.registration_number || data.email || "N/A",
                            name: data.name || (prescription.patientName && prescription.patientName !== "Unknown Patient" ? prescription.patientName : "Unknown"),
                            age: data.age || "N/A",
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch patient", err);
                }
            };
            fetchPatient();
        }
    }, [prescription?.patientId, prescription?.patientName]);

    // 🖨 Print
    const handlePrint = () => {
        window.print();
    };

    // 📄 PDF Download
    const handleDownload = async () => {
        if (!printRef.current || isDownloading) return;
        try {
            setIsDownloading(true);
            await downloadElementAsPdf({
                element: printRef.current,
                filename: `prescription-${prescriptionId}.pdf`,
                targetWidth: 800,
            });
        } catch (err) {
            console.error("Prescription PDF generation failed:", err);
            alert("Failed to generate PDF. Please try again or use the Print button.");
        } finally {
            setIsDownloading(false);
        }
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
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                    ← Back
                </button>

                <Card>
                    <div
                        ref={printRef}
                        className="print-area bg-white p-6 sm:p-8 rounded-sm shadow-md text-sm print:shadow-none print:p-0 relative overflow-x-auto md:overflow-hidden"
                    >
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 print:opacity-[0.04]">
                            <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="Watermark" className="w-2/3 max-w-[500px] object-contain" />
                        </div>

                        {/* Content Wrapper */}
                        <div className="relative z-10 flex flex-col h-full min-h-[800px] min-w-[300px]">
                            {/* Header */}
                            <div className="grid grid-cols-[auto_1fr_auto] items-center border-b-2 border-blue-800 pb-4 mb-6">
                                <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                                <div className="text-center px-2">
                                    <h2 className="text-xl sm:text-2xl font-bold text-blue-900 uppercase tracking-wide">RUET Health Complex</h2>
                                    <p className="text-xs sm:text-sm text-gray-700 font-medium">Rajshahi University of Engineering & Technology</p>
                                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Kazla, Rajshahi-6204, Bangladesh</p>
                                </div>
                                <div className="w-16 sm:w-20"></div> {/* Spacer to maintain perfect center alignment */}
                            </div>

                            {/* Patient Info */}
                            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-sm border-b border-gray-200 pb-4 mb-6">
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Patient Name:</span>
                                    <span className="font-semibold text-gray-800">{patient?.name && patient.name !== "Unknown" ? patient.name : (prescription.patientName && prescription.patientName !== "Unknown Patient" ? prescription.patientName : "Unknown")}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Date:</span>
                                    <span className="font-semibold text-gray-800">{new Date(prescription.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">ID No.:</span>
                                    <span className="font-semibold text-gray-800">{patient?.universityId && patient.universityId !== "N/A" ? patient.universityId : <PatientIdLabel patientId={prescription.patientId} />}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Age:</span>
                                    <span className="font-semibold text-gray-800">{patient?.age && patient.age !== "N/A" ? `${patient.age} Years` : "N/A"}</span>
                                </div>
                            </div>

                            {/* Problem */}
                            <div className="mb-6">
                                <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                    <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                    <h3 className="font-semibold text-blue-900">Clinical Diagnosis</h3>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded-md text-gray-700 min-h-[60px]">
                                    {prescription.problem || "No diagnosis recorded."}
                                </div>
                            </div>

                            {/* Rx Symbol */}
                            <div className="mb-4 flex items-center">
                                <span className="text-4xl font-serif font-bold text-blue-900">℞</span>
                            </div>

                            {/* Medicines */}
                            <div className={`space-y-3 ${prescription.medicines.length > 0 ? 'min-h-[150px]' : ''}`}>
                                {prescription.medicines.length === 0 && (!prescription.tests || prescription.tests.length === 0) && !prescription.advice ? (
                                    <p className="text-gray-400 italic text-center mt-10">No medicines prescribed</p>
                                ) : (
                                    prescription.medicines.map((m, i) => (
                                        <div key={i} className="flex justify-between items-start mb-3 group">
                                            <div className="flex gap-2">
                                                <span className="font-bold text-gray-800">{i + 1}.</span>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-base">{m.name}</div>
                                                    <div className="text-sm text-gray-600 mt-1 flex items-center">
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
                            {prescription.tests && prescription.tests.length > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-3 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="font-semibold text-blue-900">Recommended Tests</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pl-2">
                                        {prescription.tests.map((t) => (
                                            <div key={t.id} className="text-sm text-gray-800 flex items-start">
                                                <span className="text-blue-600 mr-2 mt-0.5 font-bold">•</span>
                                                <span className="leading-snug">{t.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Advice */}
                            {prescription.advice && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="font-semibold text-blue-900">Doctor's Advice / Suggestions</h3>
                                    </div>
                                    <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                                        {prescription.advice}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-24 flex-grow flex flex-col justify-end">
                                {/* Signatures */}
                                <div className="flex justify-between items-end pb-6">
                                    <div className="text-center w-40 sm:w-48">
                                        <div className="border-t border-gray-800 w-full mb-2"></div>
                                        <p className="text-xs sm:text-sm text-gray-800 font-semibold">Patient Signature</p>
                                    </div>

                                    <div className="text-center w-40 sm:w-48">
                                        <div className="border-t border-gray-800 w-full mb-2"></div>
                                        <p className="font-bold text-gray-800 text-sm sm:text-base">
                                          {prescription.doctorName?.startsWith("Dr.") ? prescription.doctorName : `Dr. ${prescription.doctorName || "Doctor"}`}
                                        </p>
                                        <p className="text-xs text-gray-600 font-medium capitalize">
                                            Medical Officer
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-4 border-t border-gray-300 text-center">
                                    <p className="text-xs text-gray-600">
                                        <span className="font-bold text-blue-900">RUET Health Complex</span> | Rajshahi University of Engineering & Technology
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">This prescription is electronically generated by RUET Health Complex.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 justify-center border-t pt-4">
                        <Button type="button" onClick={handlePrint} className="px-4 py-2 text-sm">
                            Print Prescription
                        </Button>

                        <Button 
                            type="button"
                            onClick={handleDownload} 
                            disabled={isDownloading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-4 py-2 text-sm flex items-center gap-2"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <span>Download PDF</span>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
}
