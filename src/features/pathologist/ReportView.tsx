import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { ArrowLeft, Printer, Download, CheckCircle, Loader2 } from "lucide-react";
import { downloadElementAsPdf } from "../../lib/pdfDownloader";

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const report = useLaboratoryStore((s) => s.reports.find(r => r.id === id));
  const fetchLaboratoryData = useLaboratoryStore((s) => s.fetchLaboratoryData);

  useEffect(() => {
    fetchLaboratoryData();
  }, [fetchLaboratoryData]);

  if (!report) {
    return <div className="p-8 text-center text-gray-500">Report not found.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadElementAsPdf({
        element: printRef.current,
        filename: `LabReport_${report.patientId}_${report.id}.pdf`,
        targetWidth: 800,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again or use the Print button.");
    } finally {
      setIsDownloading(false);
    }
  };

  const isFinalized = report.status === "Completed" || report.status === "Validated";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6 print:hidden relative">
        <div className="z-10 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          {isFinalized && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle size={14} /> Finalized Report
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 absolute w-full text-center pointer-events-none">Laboratory Report</h1>
        
        <div className="flex gap-2 z-10">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Printer size={16} /> Print
          </button>
          <button 
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-sm print:shadow-none border border-gray-200 print:border-none p-6 md:p-12 relative overflow-x-auto md:overflow-hidden" ref={printRef}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="Watermark" className="w-1/2 max-w-[400px] object-contain" />
        </div>

        <div className="relative z-10 min-w-[320px]">
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
          <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-3 text-sm mb-8">
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28 sm:w-32">Patient Name:</span>
              <span className="text-gray-900 font-medium">{report.patientName}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28 sm:w-32">Report Date:</span>
              <span className="text-gray-900 font-medium">{new Date(report.completedAt || report.validatedAt || report.requestedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28 sm:w-32">Patient ID:</span>
              <span className="text-gray-900 font-medium">{report.patientId}</span>
            </div>
            <div className="flex">
              <span className="font-semibold text-gray-600 w-28 sm:w-32">Report ID:</span>
              <span className="text-gray-900 font-medium">{report.id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* Test Title */}
          <div className="bg-gray-100 p-3 rounded-md mb-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 text-center text-lg">{report.testName}</h3>
          </div>

          {/* Results Table */}
          <div className="mb-8 overflow-x-auto">
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
              {/* Secondary signature area */}
            </div>
            <div className="text-center border-t border-gray-400 pt-2">
              <p className="font-bold text-gray-900">{report.reportedByName}</p>
              <p className="text-gray-600 text-xs">Consultant Pathologist</p>
              <p className="text-emerald-700 font-medium text-[10px] mt-1">
                Status: Electronically Certified & Finalized
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center border-t border-gray-200 pt-4">
            <p className="text-[10px] text-gray-400">This is an electronically generated report. It has been validated and finalized by the consultant pathologist.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
