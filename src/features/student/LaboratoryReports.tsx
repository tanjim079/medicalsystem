import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { FileText } from "lucide-react";

export default function LaboratoryReports() {
  const user = useAuthStore((s) => s.user);
  const allReports = useLaboratoryStore(s => s.reports);
  
  if (!user) return null;

  const reports = allReports.filter(r => r.patientId.toLowerCase() === user.id.toLowerCase() && r.status === 'Validated');

  return (
    <Card>
      <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <FileText size={20} />
        </div>
        <h2 className="font-bold text-gray-800 text-lg">Laboratory Reports</h2>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p>No validated laboratory reports available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50 hover:bg-white hover:shadow-sm transition-all group">
              <div>
                <h3 className="font-bold text-gray-800">{report.testName}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 font-medium">
                    {new Date(report.validatedAt || report.completedAt || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-gray-500">
                    Reported by: {report.reportedByName}
                  </span>
                </div>
              </div>
              
              <Link 
                to={`/reports/view/${report.id}`} 
                target="_blank"
                className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
