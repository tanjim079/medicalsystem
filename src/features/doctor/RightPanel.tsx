import { useEffect } from "react";
import type { Patient } from "../../types/patient";
import Card from "../../components/ui/Card";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { Link } from "react-router-dom";
import { FileText, ChevronRight, Activity } from "lucide-react";

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

  const validReports = allReports.filter(
    r => r.patientId.toLowerCase() === patient.universityId.toLowerCase() && r.status === 'Validated'
  );

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Activity size={18} />
          </div>
          <h2 className="font-bold text-gray-900 tracking-tight text-lg">Recent Lab Reports</h2>
        </div>
        
        {validReports.length === 0 ? (
          <div className="text-sm text-gray-400 italic bg-gray-50/50 p-6 rounded-lg text-center border border-gray-100 border-dashed">
            No validated reports found for this patient.
          </div>
        ) : (
          <div className="space-y-3">
            {validReports.map(report => (
              <div 
                key={report.id} 
                className="group relative text-sm border border-gray-100 rounded-xl p-3 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-500 mt-0.5 group-hover:bg-blue-100 transition-colors">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{report.testName}</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {new Date(report.validatedAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <Link 
                  to={`/reports/view/${report.id}`} 
                  target="_blank" 
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
