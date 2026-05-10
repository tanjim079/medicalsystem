import { useState, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Search, Printer, Download, Trash2, Plus } from "lucide-react";
import { medicalTests } from "../../data/tests";
import type { MedicalTest } from "../../data/tests";
import { mockPatients } from "../../data/mockPatients";
import { useBillingStore } from "../../store/useBillingStore";
import type { Bill } from "../../store/useBillingStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TestBilling() {
  const [patientId, setPatientId] = useState("");
  const [selectedTests, setSelectedTests] = useState<MedicalTest[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Mobile Banking">("Cash");
  const [status, setStatus] = useState<"Paid" | "Due">("Paid");

  const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);

  const addBill = useBillingStore((s) => s.addBill);
  const printRef = useRef<HTMLDivElement>(null);

  const patient = mockPatients.find((p) => p.universityId.toLowerCase() === patientId.toLowerCase());

  const subTotal = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const taxAmount = (subTotal * tax) / 100;
  const totalAmount = subTotal + taxAmount - discount;

  const handleAddTest = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const testId = e.target.value;
    if (!testId) return;

    const test = medicalTests.find((t) => t.id === testId);
    if (test && !selectedTests.find((t) => t.id === testId)) {
      setSelectedTests([...selectedTests, test]);
    }
    e.target.value = ""; // Reset select
  };

  const handleRemoveTest = (id: string) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== id));
  };

  const handleGenerateBill = () => {
    if (!patient) {
      alert("Please select a valid patient first.");
      return;
    }
    if (selectedTests.length === 0) {
      alert("Please add at least one test.");
      return;
    }

    const bill = addBill({
      patientId: patient.universityId,
      patientName: patient.name,
      tests: selectedTests,
      subTotal,
      discount,
      tax,
      totalAmount,
      paymentMethod,
      status,
    });

    setGeneratedBill(bill);
    alert(`Bill generated successfully! Invoice ID: ${bill.id}`);
  };

  const resetForm = () => {
    setGeneratedBill(null);
    setSelectedTests([]);
    setPatientId("");
    setDiscount(0);
    setTax(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current || !generatedBill) return;

    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`${generatedBill.id}.pdf`);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Test Billing & Invoice</h1>
          <p className="text-gray-600">Create bills for medical tests</p>
        </div>
        {generatedBill && (
          <Button variant="outline" onClick={resetForm}>
            <Plus size={18} className="inline mr-2" /> New Bill
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* LEFT PANEL: Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <Card className={generatedBill ? "opacity-50 pointer-events-none" : ""}>
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Patient Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Enter Patient ID (e.g. 2204001)"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {patient ? (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
                  <strong>Name:</strong> {patient.name} <br />
                  <strong>Age/Gender:</strong> {patient.age} / M <br />
                  <strong>Contact:</strong> {patient.phone}
                </div>
              ) : (
                patientId && <p className="text-red-500 text-sm">Patient not found</p>
              )}
            </div>
          </Card>

          <Card className={generatedBill ? "opacity-50 pointer-events-none" : ""}>
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Select Tests</h2>
            <div className="space-y-4">
              <select
                aria-label="Select Medical Test"
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleAddTest}
                defaultValue=""
              >
                <option value="" disabled>Select a medical test to add...</option>
                {medicalTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - ৳{t.price}
                  </option>
                ))}
              </select>

              {/* Selected Tests List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedTests.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                    <span className="text-sm font-medium">{t.name}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-semibold">৳{t.price}</span>
                      <button aria-label="Remove Test" onClick={() => handleRemoveTest(t.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedTests.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-2">No tests added yet.</p>
                )}
              </div>
            </div>
          </Card>

          <Card className={generatedBill ? "opacity-50 pointer-events-none" : ""}>
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Payment Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (৳)</label>
                  <Input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax/VAT (%)</label>
                  <Input
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    aria-label="Payment Method"
                    className="w-full border rounded-lg px-3 py-2"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as "Cash" | "Card" | "Mobile Banking")}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    aria-label="Payment Status"
                    className="w-full border rounded-lg px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Paid" | "Due")}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Due">Due</option>
                  </select>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-blue-50 p-4 rounded-lg mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">৳{subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({tax}%):</span>
                  <span className="font-semibold">+৳{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-৳{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2 text-lg font-bold text-blue-800">
                  <span>Total Amount:</span>
                  <span>৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {!generatedBill && (
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleGenerateBill}>
                  Generate Bill & Invoice
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: Invoice Preview */}
        <div className="lg:col-span-7">
          <Card className="h-full print:shadow-none print:border-none print:p-0">
            <div className="flex justify-between items-center mb-4 border-b pb-2 print:hidden">
              <h2 className="text-lg font-bold">Invoice Preview</h2>
              {generatedBill && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 text-sm px-3 py-1">
                    <Printer size={16} /> Print
                  </Button>
                  <Button onClick={handleDownload} className="flex items-center gap-2 text-sm px-3 py-1">
                    <Download size={16} /> PDF
                  </Button>
                </div>
              )}
            </div>

            {generatedBill ? (
              <div ref={printRef} className="print-area bg-white p-8 border rounded-lg shadow-sm mx-auto max-w-[600px]">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-800 uppercase tracking-wide">RUET Medical Center</h2>
                    <p className="text-sm text-gray-600 font-medium">Rajshahi University of Engineering & Technology</p>
                    <p className="text-xs text-gray-500">Kazla, Rajshahi-6204</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-300 uppercase">INVOICE</h1>
                    <p className="font-bold text-gray-800 mt-1">{generatedBill.id}</p>
                    <p className="text-sm text-gray-500">{new Date(generatedBill.date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="mb-8">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Billed To:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold text-gray-800 text-lg">{generatedBill.patientName}</p>
                    <p className="text-sm text-gray-600">Student ID: {generatedBill.patientId}</p>
                  </div>
                </div>

                {/* Tests Table */}
                <table className="w-full text-left mb-8 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-2 text-sm font-bold text-gray-600 uppercase">Description</th>
                      <th className="py-2 text-sm font-bold text-gray-600 uppercase text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedBill.tests.map((t, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-800">{t.name}</td>
                        <td className="py-3 text-sm text-gray-800 text-right font-medium">৳{t.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>৳{generatedBill.subTotal.toFixed(2)}</span>
                    </div>
                    {generatedBill.tax > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Tax ({generatedBill.tax}%):</span>
                        <span>৳{((generatedBill.subTotal * generatedBill.tax) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {generatedBill.discount > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>Discount:</span>
                        <span>-৳{generatedBill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t-2 border-gray-800 pt-2 text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span>৳{generatedBill.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="border-t pt-4 grid grid-cols-2 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Payment Method:</p>
                    <p className="font-bold text-gray-800">{generatedBill.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-medium">Payment Status:</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1
                      ${generatedBill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {generatedBill.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-400">
                <Printer size={48} className="mb-4 opacity-20" />
                <p>Generate a bill to preview the invoice</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
