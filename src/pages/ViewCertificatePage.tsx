import { fetchAuth } from '../lib/fetchAuth';
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Loader2 } from "lucide-react";
import { downloadElementAsPdf } from "../lib/pdfDownloader";
import { useCertificateStore } from "../store/useCertificateStore";

interface CertificatePatient {
  id: string;
  universityId: string;
  name: string;
}

export default function ViewCertificatePage() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const getCertificateById = useCertificateStore((s) => s.getCertificateById);
  const fetchCertificates = useCertificateStore((s) => s.fetchCertificates);
  const loading = useCertificateStore((s) => s.loading);
  const certificate = certificateId ? getCertificateById(certificateId) : undefined;
  
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [patient, setPatient] = useState<CertificatePatient | null>(null);

  useEffect(() => {
    if (certificate?.patientId) {
      const fetchPatient = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const response = await fetchAuth(`${apiUrl}/patients/${certificate.patientId}`);
          if (response.ok) {
            const data = await response.json();
            setPatient({
              id: data.id,
              universityId: data.employee_id || data.roll_number || data.email || "N/A",
              name: data.name,
            });
          }
        } catch (error) {
          console.error("Failed to fetch patient details:", error);
        }
      };
      fetchPatient();
    }
  }, [certificate?.patientId]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

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
              filename: `Medical_Certificate_${certificateId}.pdf`,
              targetWidth: 800,
          });
      } catch (err) {
          console.error("Certificate PDF generation failed:", err);
          alert("Failed to generate PDF. Please try again or use the Print button.");
      } finally {
          setIsDownloading(false);
      }
  };

  if (loading && !certificate) {
    return (
        <MainLayout>
            <div className="text-center mt-20 text-gray-500">Loading certificate...</div>
        </MainLayout>
    );
  }

  if (!certificate) {
    return (
        <MainLayout>
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-gray-800">Certificate Not Found</h2>
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

              {/* Certificate Title */}
              <div className="text-center mb-8 mt-2">
                <h2 className="inline-block text-xl font-bold text-gray-800 uppercase tracking-widest border-b border-gray-800 pb-1">
                  Medical Certificate
                </h2>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-sm border-b border-gray-200 pb-4 mb-6">
                  <div className="flex bg-gray-50/50 p-2 rounded">
                      <span className="text-gray-500 font-medium w-24">Patient Name:</span>
                      <span className="font-semibold text-gray-800">{certificate.patientName}</span>
                  </div>
                  <div className="flex bg-gray-50/50 p-2 rounded">
                      <span className="text-gray-500 font-medium w-24">Date Issued:</span>
                      <span className="font-semibold text-gray-800">{new Date(certificate.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex bg-gray-50/50 p-2 rounded">
                      <span className="text-gray-500 font-medium w-24">ID No.:</span>
                      <span className="font-semibold text-gray-800">{patient?.universityId || certificate.patientId}</span>
                  </div>
                  <div className="flex bg-gray-50/50 p-2 rounded">
                      <span className="text-gray-500 font-medium w-24">Ref No:</span>
                      <span className="font-semibold text-gray-800 uppercase">MC-{certificate.id.substring(0, 8)}</span>
                  </div>
              </div>

              {/* Certificate Content */}
              <div className="px-2 sm:px-4 py-4 mb-6">
                <div className="space-y-6 text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                  <p className="text-justify indent-8">
                    This is to certify that <strong>{certificate.patientName}</strong> (ID No.: <strong>{patient?.universityId || certificate.patientId}</strong>) has been examined by me at the RUET Health Complex.
                  </p>
                  
                  <p className="text-justify indent-8">
                    Based on clinical evaluation, the patient has been diagnosed with <span className="font-bold underline decoration-dotted underline-offset-4">{certificate.diagnosis}</span>.
                  </p>

                  <p className="text-justify indent-8">
                    A medical leave of absence is strongly recommended for a period of <strong>{certificate.recommendedRestDays} days</strong>, commencing on <strong>{new Date(certificate.restStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong> and concluding on <strong>{new Date(certificate.restEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>, to ensure proper rest and recovery.
                  </p>
                </div>
              </div>

              {/* Additional Remarks */}
              {certificate.remarks && (
                  <div className="mb-8">
                      <div className="flex items-center mb-2 border-b border-gray-200 pb-1">
                          <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} className="w-5 h-5 mr-2 opacity-80" alt="Logo" />
                          <h3 className="font-semibold text-blue-900">Additional Remarks / Suggestions</h3>
                      </div>
                      <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                          {certificate.remarks}
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
                          <p className="font-bold text-gray-800 text-sm sm:text-base">{certificate.doctorName}</p>
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
                      <p className="text-[10px] text-gray-400 mt-1">This certificate is electronically generated by RUET Health Complex.</p>
                  </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 justify-center border-t pt-4">
              <Button type="button" onClick={handlePrint} className="px-4 py-2 text-sm">
                  Print Certificate
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
