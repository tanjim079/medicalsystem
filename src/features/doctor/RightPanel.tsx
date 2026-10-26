import { useEffect } from "react";
import type { Patient } from "../../types/patient";
import Card from "../../components/ui/Card";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, ExternalLink, User } from "lucide-react";

export default function RightPanel({
  patient,
}: {
  patient: Patient | null;
}) {
  const allReports = useLaboratoryStore(s => s.reports);
  const fetchLaboratoryData = useLaboratoryStore(s => s.fetchLaboratoryData);

  useEffect(() => {
    fetchLaboratoryData();
  }, [fetchLaboratoryData]);

  if (!patient) return null;

  const patientIdLower = (patient.universityId || patient.id || '').toLowerCase();
  const validReports = allReports.filter(r => {
    const rPatLower = (r.patientId || '').toLowerCase();
    const isMatch = rPatLower === patientIdLower || (patient.id && rPatLower === patient.id.toLowerCase());
    const isFinal = r.status === 'Completed' || r.status === 'Validated';
    return isMatch && isFinal;
  });

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 tracking-tight text-base">Laboratory Reports</h2>
              <p className="text-xs text-gray-500">Diagnostic history for {patient.name}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {validReports.length} Available
          </span>
        </div>
        
        {validReports.length === 0 ? (
          <div className="text-sm text-gray-400 italic bg-gray-50/50 p-6 rounded-lg text-center border border-gray-100 border-dashed">
            No finalized laboratory reports available for this patient.
          </div>
        ) : (
          <div className="space-y-3">
            {validReports.map(report => (
              <div 
                key={report.id} 
                className="group relative text-sm border border-gray-100 rounded-xl p-3.5 bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {report.testName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>ID: {patient.universityId}</span>
                      <span>•</span>
                      <span>
                        {new Date(report.completedAt || report.validatedAt || report.requestedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle size={11} /> Completed
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2 text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <User size={12} className="text-gray-400" />
                    {report.reportedByName || "Consultant Pathologist"}
                  </span>
                  
                  <Link 
                    to={`/reports/view/${report.id}`} 
                    target="_blank" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <ExternalLink size={12} /> View / Download
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
