import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CheckCircle, Search, Clock, AlertCircle } from "lucide-react";
import { useBillingStore } from "../../store/useBillingStore";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";

export default function ReportClearance() {
  const [searchTerm, setSearchTerm] = useState("");
  const fetchLaboratoryData = useLaboratoryStore((s) => s.fetchLaboratoryData);
  const { bills, fetchBills } = useBillingStore();
  const reports = useLaboratoryStore((s) => s.reports);
  const approveReport = useLaboratoryStore((s) => s.approveReport);

  useEffect(() => {
    fetchLaboratoryData();
    fetchBills();
  }, [fetchLaboratoryData, fetchBills]);

  // Filter reports that are 'Awaiting Payment'
  const pendingReports = reports.filter(r => r.status === "Awaiting Payment" && (
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testName.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleApprove = (id: string) => {
    if (window.confirm("Has the patient cleared the bill for this test? Approving this will release the report to the patient.")) {
      approveReport(id);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Report Clearance</h1>
        <p className="text-gray-600">Release validated lab reports to patients after payment verification</p>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Patient Name, ID, or Test Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4 text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Clock size={20} />
          <span className="font-medium text-sm">Reports shown here have been medically validated by the pathologist and are awaiting financial clearance before release.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Test Name</th>
                <th className="p-4 font-semibold">Payment Record</th>
                <th className="p-4 font-semibold">Validated By</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingReports.length > 0 ? (
                pendingReports.map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{report.patientName}</p>
                      <p className="text-xs text-gray-500">{report.patientId}</p>
                    </td>
                                        <td className="p-4">
                      <span className="font-medium text-blue-700">{report.testName}</span>
                    </td>
                    <td className="p-4">
                      {(() => {
                        const relatedBill = bills.find(b => 
                          b.patientId === report.patientId && 
                          b.tests.some(t => t.name === report.testName)
                        );
                        if (!relatedBill) return <span className="text-xs text-gray-400">No bill found</span>;
                        return (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-mono">{relatedBill.id}</span>
                            {relatedBill.status === 'Paid' ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle size={12} /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                                <AlertCircle size={12} /> Due
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {report.reportedByName}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(report.completedAt || report.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        onClick={() => handleApprove(report.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 text-sm ml-auto"
                      >
                        <CheckCircle size={16} /> Approve & Release
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No reports awaiting payment clearance.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}

