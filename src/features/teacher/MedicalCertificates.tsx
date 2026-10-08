import { FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCertificateStore } from "../../store/useCertificateStore";

export default function MedicalCertificates() {
  const user = useAuthStore((s) => s.user);
  const getCertificatesByPatient = useCertificateStore((s) => s.getCertificatesByPatient);
  const fetchCertificates = useCertificateStore((s) => s.fetchCertificates);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const certificates = user ? getCertificatesByPatient(user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
          <FileText size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Medical Certificates</h2>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No medical certificates found.</p>
          <p className="text-sm text-gray-400 mt-1">Certificates issued by your doctor will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{cert.diagnosis}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {cert.recommendedRestDays} Days Leave
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Valid: <span className="font-semibold text-gray-700">{new Date(cert.restStartDate).toLocaleDateString()}</span> to <span className="font-semibold text-gray-700">{new Date(cert.restEndDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Issued by:</span>
                    <span className="font-semibold text-gray-700">{cert.doctorName}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(cert.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link
                  to={`/certificate/view/${cert.id}`}
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <Download size={16} />
                  View & Download
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
