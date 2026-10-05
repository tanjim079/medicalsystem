import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowLeft, Printer, Download, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore((s) => s.user);
  const report = useLaboratoryStore((s) => s.reports.find(r => r.id === id));
  const validateReport = useLaboratoryStore((s) => s.validateReport);

  if (!report) {
    return <div className="p-8 text-center text-gray-500">Report not found.</div>;
  }

  const isPathologist = user?.role === "pathologist";
  const canValidate = isPathologist && report.status === "Awaiting Validation";

  const handleValidate = () => {
    validateReport(report.id);
    alert("Report validated successfully.");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LabReport_${report.patientId}_${report.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6 print:hidden relative">
        <div className="z-10">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 absolute w-full text-center pointer-events-none">Laboratory Report</h1>
        
        <div className="flex gap-2 z-10">
          {canValidate && (
            <button 
              onClick={handleValidate}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <CheckCircle size={16} /> Validate Report
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Printer size={16} /> Print
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-sm print:shadow-none border border-gray-200 print:border-none p-8 md:p-12 relative overflow-hidden" ref={printRef}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
            <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="Watermark" className="w-1/2 max-w-[400px] object-contain" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center border-b-2 border-blue-800 pb-6 mb-8 text-center">
            <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET Logo" className="w-20 h-20 object-contain mb-3" />
            <h2 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">RUET Health Complex</h2>
            <p className="text-sm text-gray-700 font-medium">Rajshahi University of Engineering & Technology</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-2">Kazla, Rajshahi-6204, Bangladesh</p>
            <div className="bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-2">
              Laboratory / Pathology Report
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm mb-8">
            <div className="flex">
              <span className="font-semibold text-gray-600 w-32">Patient Name:</span>
              <span className="text-gray-900 font-medium">{report.patientName}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-32">Report Date:</span>
              <span className="text-gray-900 font-medium">{new Date(report.completedAt || report.requestedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-32">Patient ID:</span>
              <span className="text-gray-900 font-medium">{report.patientId}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-32">Report ID:</span>
              <span className="text-gray-900 font-medium">{report.id}</span>
            </div>
          </div>

          {/* Test Title */}
          <div className="bg-gray-100 p-3 rounded-md mb-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-center text-lg">{report.testName}</h3>
          </div>

          {/* Results Table */}
          <div className="mb-8">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-700">
                  <th className="py-2 px-2 font-bold w-2/5">Test Parameter</th>
                  <th className="py-2 px-2 font-bold">Result</th>
                  <th className="py-2 px-2 font-bold">Unit</th>
                  <th className="py-2 px-2 font-bold">Reference Range</th>
                </tr>
              </thead>
              <tbody>
                {report.parameters.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-2 text-gray-800 font-medium">{p.name}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${p.flag === 'high' || p.flag === 'critical' ? 'text-red-600' : p.flag === 'low' ? 'text-orange-600' : 'text-gray-900'}`}>
                        {p.value}
                      </span>
                      {p.flag !== 'normal' && p.flag && (
                        <span className={`text-[10px] ml-1 uppercase font-bold tracking-wider ${p.flag === 'high' || p.flag === 'critical' ? 'text-red-500' : 'text-orange-500'}`}>
                          ({p.flag})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{p.unit || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{p.referenceRange || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          {report.remarks && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-800 mb-1">Remarks:</h4>
              <p className="text-sm text-gray-700">{report.remarks}</p>
            </div>
          )}

          {/* Interpretation */}
          {report.interpretation && (
            <div className="mb-12">
              <h4 className="text-sm font-bold text-gray-800 mb-1">Interpretation:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{report.interpretation}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-24 grid grid-cols-2 gap-8 text-sm pt-8">
            <div className="text-center">
              {/* Optional secondary signature area */}
            </div>
            <div className="text-center border-t border-gray-400 pt-2">
              <p className="font-bold text-gray-900">{report.reportedByName}</p>
              <p className="text-gray-600 text-xs">Consultant Pathologist</p>
              <p className="text-gray-500 text-[10px] mt-1">
                Status: {report.status === 'Validated' ? 'Electronically Validated' : (report.status === 'Awaiting Payment' ? 'Awaiting Payment Clearance' : 'Awaiting Validation')}
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center border-t border-gray-200 pt-4">
            <p className="text-[10px] text-gray-400">This is an electronically generated report. {report.status === 'Validated' ? 'It has been validated and finalized.' : 'It is currently a draft.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

