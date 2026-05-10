import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useState, useRef } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { medicines } from "../data/medicines";
import { mockPatients } from "../data/mockPatients";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuthStore } from "../store/useAuthStore";
import { usePrescriptionStore } from "../store/usePrescriptionStore";
import { Edit2 } from "lucide-react";

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
    const patient = mockPatients.find((p) => p.universityId.toLowerCase() === id?.toLowerCase());

    const [medicinesList, setMedicinesList] = useState<PrescriptionItem[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [form, setForm] = useState<PrescriptionItem>({
        medicineId: "",
        name: "",
        dosage: "",
        days: "",
    });

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
    };

    const handleEditMedicine = (index: number) => {
        const medicineToEdit = medicinesList[index];
        setForm(medicineToEdit);
        setMedicinesList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!patient || !id || medicinesList.length === 0) {
            alert("Cannot submit an empty prescription.");
            return;
        }

        addPrescription({
            patientId: id,
            doctorId: user?.id || "unknown",
            doctorName: user?.name || "Doctor",
            problem: problem,
            medicines: medicinesList,
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
                Prescription for {id}
            </h1>

            <div className="grid grid-cols-2 gap-6 print:block">

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

                                    <select
                                        id="medicine"
                                        name="medicine"
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={form.medicineId}
                                        onChange={(e) => {
                                            const selected = medicines.find(
                                                (m) => m.id === e.target.value
                                            );

                                            setForm({
                                                ...form,
                                                medicineId: e.target.value,
                                                name: selected?.name || "",
                                            });
                                        }}
                                    >
                                        <option value="">Select Medicine</option>
                                        {medicines.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} {m.stock === 0 ? "(Out of stock)" : ""}
                                            </option>
                                        ))}
                                    </select>
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
                            </>
                        )}
                    </div>
                </Card>
                </div>

                {/* RIGHT: PREVIEW */}
                <Card className="print:shadow-none print:border-none print:p-0">
                    <div
                        ref={printRef}
                        className="print-area bg-white p-6 rounded shadow text-sm"
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
                                <p><span className="text-gray-500 font-medium">Date:</span> <span className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</span></p>
                            </div>
                            <div>
                                <p><span className="text-gray-500 font-medium">Student ID:</span> <span className="font-semibold text-gray-800">{id}</span></p>
                            </div>
                            <div className="text-right">
                                <p><span className="text-gray-500 font-medium">Age:</span> <span className="font-semibold text-gray-800">{patient?.age || "N/A"} Years</span></p>
                            </div>
                        </div>

                        {/* Problem */}
                        <div className="mb-6">
                            <p className="font-semibold text-blue-800 mb-2 border-b border-gray-100 pb-1">Clinical Diagnosis:</p>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-700 min-h-[60px] italic">
                                {problem || "No diagnosis recorded."}
                            </p>
                        </div>

                        {/* Rx Symbol */}
                        <div className="mb-4 text-4xl font-serif font-bold text-blue-800">℞</div>

                        {/* Medicines */}
                        <div className="space-y-4 min-h-[200px]">
                            {medicinesList.length === 0 ? (
                                <p className="text-gray-400 italic text-center mt-10">No medicines prescribed</p>
                            ) : (
                                medicinesList.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-2 group">
                                        <div>
                                            <span className="font-bold text-gray-800 text-base">
                                                {i + 1}. {m.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-1 rounded">{m.dosage}</span>
                                            <span className="text-gray-500">× {m.days} days</span>
                                            {!isSubmitted && (
                                                <button
                                                    onClick={() => handleEditMedicine(i)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                    title="Edit Medicine"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
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
                                <p className="font-bold text-gray-800 text-center">{user?.name || "Doctor"}</p>
                                <p className="text-xs text-blue-600 font-medium text-center capitalize">
                                    {user?.role || "Medical Officer"}
                                </p>
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