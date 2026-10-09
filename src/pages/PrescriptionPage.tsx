import { fetchAuth } from '../lib/fetchAuth';
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useState, useRef, useEffect } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useMedicineStore } from "../store/useMedicineStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuthStore } from "../store/useAuthStore";
import { usePrescriptionStore } from "../store/usePrescriptionStore";
import { Edit2, X, Search } from "lucide-react";
import type { MedicalTest } from "../data/tests";
import { useTestStore } from "../store/useTestStore";

interface PrescriptionItem {
    medicineId: string;
    name: string;
    dosage: string;
    days: string;
}

export default function PrescriptionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);

    const [problem, setProblem] = useState("");

    const user = useAuthStore((s) => s.user);
    const addPrescription = usePrescriptionStore((s) => s.addPrescription);
    
    const { tests: medicalTests, fetchTests } = useTestStore();
    const { medicines, fetchMedicines } = useMedicineStore();

    const [patient, setPatient] = useState<any | null>(null);

    useEffect(() => {
        fetchTests();
        fetchMedicines();
    }, [fetchTests, fetchMedicines]);

    useEffect(() => {
        if (id) {
            const fetchPatient = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                    const response = await fetchAuth(`${apiUrl}/patients/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPatient({
                            id: data.id,
                            universityId: data.employee_id || data.roll_number || data.email || "N/A",
                            name: data.name,
                            age: data.age || "N/A",
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch patient", err);
                }
            };
            fetchPatient();
        }
    }, [id]);

    const [medicinesList, setMedicinesList] = useState<PrescriptionItem[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [form, setForm] = useState<PrescriptionItem>({
        medicineId: "",
        name: "",
        dosage: "",
        days: "",
    });

    const [medicineSearchQuery, setMedicineSearchQuery] = useState("");
    const [isMedicineDropdownOpen, setIsMedicineDropdownOpen] = useState(false);

    const [selectedTests, setSelectedTests] = useState<MedicalTest[]>([]);
    const [testSearchQuery, setTestSearchQuery] = useState("");
    const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);

    const [advice, setAdvice] = useState("");

    const addMedicine = () => {
        const selected = medicines.find((m) => m.id === form.medicineId);
        if (!selected) return;

        if (selected.stock === 0) {
            alert("Out of stock");
            return;
        }

        setMedicinesList((prev) => [...prev, form]);

        setForm({
            medicineId: "",
            name: "",
            dosage: "",
            days: "",
        });
        setMedicineSearchQuery("");
    };

    const handleEditMedicine = (index: number) => {
        const medicineToEdit = medicinesList[index];
        setForm(medicineToEdit);
        setMedicineSearchQuery(medicineToEdit.name);
        setMedicinesList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddTest = (test: MedicalTest) => {
        if (!selectedTests.find((t) => t.id === test.id)) {
            setSelectedTests([...selectedTests, test]);
        }
        setTestSearchQuery("");
        setIsTestDropdownOpen(false);
    };

    const handleRemoveTest = (id: string) => {
        setSelectedTests(selectedTests.filter(t => t.id !== id));
    };

    const handleSubmit = async () => {
        if (!patient || !id || (medicinesList.length === 0 && selectedTests.length === 0)) {
            alert("Cannot submit an empty prescription.");
            return;
        }

        await addPrescription({
            patientId: patient?.universityId || id,
            patientName: patient?.name || 'Unknown Patient',
            doctorId: user?.id || "unknown",
            doctorName: user?.name || "Doctor",
            problem: problem,
            medicines: medicinesList,
            tests: selectedTests.map(t => ({ id: t.id, name: t.name })),
            advice: advice,
        });

        

        setIsSubmitted(true);
        alert("Prescription submitted successfully!");
    };

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
        pdf.save("prescription.pdf");
    };

    return (
        <MainLayout>
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-200 px-3 py-1 rounded print:hidden"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-bold mb-4 print:hidden">
                Prescription for {patient?.universityId || id}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block">

                {/* LEFT: FORM */}
                <div className="print:hidden">
                    <Card>
                        <div className="space-y-4">
                            {isSubmitted ? (
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-lg mb-1">Prescription Submitted</h3>
                                    <p className="text-sm">This prescription has been finalized and submitted to the patient's record. Editing is no longer possible.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Problem */}
                                    <div>
                                        <label className="block text-sm mb-1">
                                            Problem / Diagnosis
                                        </label>
                                        <textarea
                                            className="w-full border rounded-lg p-2"
                                            value={problem}
                                            onChange={(e) => setProblem(e.target.value)}
                                            placeholder="Enter patient problem..."
                                        />
                                    </div>

                                    {/* Medicine */}
                                    <div>
                                        <label
                                            htmlFor="medicine"
                                            className="block text-sm mb-1"
                                        >
                                            Medicine
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full border rounded-lg pl-10 pr-3 py-2"
                                                placeholder="Search medicine by name..."
                                                value={medicineSearchQuery}
                                                onChange={(e) => {
                                                    setMedicineSearchQuery(e.target.value);
                                                    setIsMedicineDropdownOpen(true);
                                                    if (e.target.value === "") {
                                                        setForm({ ...form, medicineId: "", name: "" });
                                                    }
                                                }}
                                                onFocus={() => setIsMedicineDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsMedicineDropdownOpen(false), 200)}
                                            />
                                            {isMedicineDropdownOpen && medicineSearchQuery && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {medicines
                                                        .filter((m) => m.name.toLowerCase().includes(medicineSearchQuery.toLowerCase()))
                                                        .map((m) => (
                                                            <div
                                                                key={m.id}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                                                                onClick={() => {
                                                                    setForm({
                                                                        ...form,
                                                                        medicineId: m.id,
                                                                        name: m.name,
                                                                    });
                                                                    setMedicineSearchQuery(m.name);
                                                                    setIsMedicineDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span>{m.name}</span>
                                                                {m.stock === 0 && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Out of stock</span>}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Input
                                        placeholder="Dosage"
                                        value={form.dosage}
                                        onChange={(e) =>
                                            setForm({ ...form, dosage: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Days"
                                        value={form.days}
                                        onChange={(e) =>
                                            setForm({ ...form, days: e.target.value })
                                        }
                                    />

                                    <Button onClick={addMedicine}>
                                        Add Medicine
                                    </Button>

                                    <hr className="my-4 border-gray-200" />

                                    {/* Diagnostic Tests */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Diagnostic Tests
                                        </label>
                                        <div className="relative mb-3">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full border rounded-lg pl-10 pr-3 py-2"
                                                placeholder="Search diagnostic tests..."
                                                value={testSearchQuery}
                                                onChange={(e) => {
                                                    setTestSearchQuery(e.target.value);
                                                    setIsTestDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsTestDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsTestDropdownOpen(false), 200)}
                                            />
                                            {isTestDropdownOpen && testSearchQuery && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {medicalTests
                                                        .filter((t) => t.name.toLowerCase().includes(testSearchQuery.toLowerCase()))
                                                        .map((t) => (
                                                            <div
                                                                key={t.id}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                                onClick={() => handleAddTest(t)}
                                                            >
                                                                {t.name} <span className="text-xs text-gray-500 ml-2">({t.category})</span>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>

                                        {selectedTests.length > 0 && (
                                            <div className="space-y-2 mt-2">
                                                {selectedTests.map((t) => (
                                                    <div key={t.id} className="flex justify-between items-center bg-gray-50 border px-3 py-2 rounded-lg text-sm">
                                                        <span>{t.name}</span>
                                                        <button onClick={() => handleRemoveTest(t.id)} className="text-gray-400 hover:text-red-500 p-1">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <hr className="my-4 border-gray-200" />

                                    {/* Additional Suggestions */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Additional Suggestions / Doctor's Advice
                                        </label>
                                        <textarea
                                            className="w-full border rounded-lg p-3 text-sm"
                                            rows={4}
                                            value={advice}
                                            onChange={(e) => setAdvice(e.target.value)}
                                            placeholder="e.g. Drink plenty of water, rest for 3 days..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* RIGHT: PREVIEW */}
                <Card className="print:shadow-none print:border-none print:p-0">
                    <div
                        ref={printRef}
                        className="print-area bg-white p-8 rounded-sm shadow-md text-sm print:shadow-none print:p-0 relative"
                    >
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 print:opacity-[0.04]">
                            <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="Watermark" className="w-2/3 max-w-[500px] object-contain" />
                        </div>

                        {/* Content Wrapper */}
                        <div className="relative z-10 flex flex-col h-full min-h-[800px]">
                            {/* Header */}
                            <div className="grid grid-cols-[auto_1fr_auto] items-center border-b-2 border-blue-800 pb-4 mb-6">
                                <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET Logo" className="w-20 h-20 object-contain" />
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">RUET Health Complex</h2>
                                    <p className="text-sm text-gray-700 font-medium">Rajshahi University of Engineering & Technology</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Kazla, Rajshahi-6204, Bangladesh</p>
                                </div>
                                <div className="w-20"></div> {/* Spacer to maintain perfect center alignment */}
                            </div>

                            {/* Patient Info */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-b border-gray-200 pb-4 mb-6">
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Patient Name:</span>
                                    <span className="font-semibold text-gray-800">{patient?.name || "Unknown"}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Date:</span>
                                    <span className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">ID No.:</span>
                                    <span className="font-semibold text-gray-800">{patient?.universityId || id}</span>
                                </div>
                                <div className="flex bg-gray-50/50 p-2 rounded">
                                    <span className="text-gray-500 font-medium w-24">Age:</span>
                                    <span className="font-semibold text-gray-800">{patient?.age || "N/A"} Years</span>
                                </div>
                            </div>

                            {/* Problem */}
                            <div className="mb-6">
                                <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                    <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                    <h3 className="font-semibold text-blue-900">Clinical Diagnosis</h3>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded-md text-gray-700 min-h-[60px]">
                                    {problem || "No diagnosis recorded."}
                                </div>
                            </div>

                            {/* Rx Symbol */}
                            <div className="mb-4 flex items-center">
                                <span className="text-4xl font-serif font-bold text-blue-900">℞</span>
                            </div>

                            {/* Medicines */}
                            <div className={`space-y-3 ${medicinesList.length > 0 ? 'min-h-[150px]' : ''}`}>
                                {medicinesList.length === 0 && selectedTests.length === 0 && !advice ? (
                                    <p className="text-gray-400 italic text-center mt-10">No medicines prescribed</p>
                                ) : (
                                    medicinesList.map((m, i) => (
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
                                            {!isSubmitted && (
                                                <button
                                                    onClick={() => handleEditMedicine(i)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 print:hidden mt-1"
                                                    title="Edit Medicine"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Diagnostic Tests */}
                            {selectedTests.length > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-3 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="font-semibold text-blue-900">Recommended Tests</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pl-2">
                                        {selectedTests.map((t) => (
                                            <div key={t.id} className="text-sm text-gray-800 flex items-start">
                                                <span className="text-blue-600 mr-2 mt-0.5 font-bold">•</span>
                                                <span className="leading-snug">{t.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Advice */}
                            {advice && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                                        <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                                        <h3 className="font-semibold text-blue-900">Doctor's Advice / Suggestions</h3>
                                    </div>
                                    <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                                        {advice}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-24 flex-grow flex flex-col justify-end">
                                {/* Signatures */}
                                <div className="flex justify-between items-end pb-6">
                                    <div className="text-center w-48">
                                        <div className="border-t border-gray-800 w-full mb-2"></div>
                                        <p className="text-sm text-gray-800 font-semibold">Patient Signature</p>
                                    </div>

                                    <div className="text-center w-48">
                                        <div className="border-t border-gray-800 w-full mb-2"></div>
                                        <p className="font-bold text-gray-800 text-base">{user?.name || "Doctor"}</p>
                                        <p className="text-xs text-gray-600 font-medium capitalize">
                                            {user?.role || "Medical Officer"}
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
                    <div className="flex gap-2 mt-4 flex-wrap items-center print:hidden">
                        <Button onClick={handlePrint}>
                            Print
                        </Button>

                        <Button onClick={handleDownload}>
                            Download PDF
                        </Button>

                        {!isSubmitted && (
                            <Button
                                onClick={handleSubmit}
                                className="ml-auto !bg-green-600 hover:!bg-green-700 text-white"
                            >
                                Submit Prescription
                            </Button>
                        )}
                    </div>
                </Card>

            </div>
        </MainLayout>
    );
}
