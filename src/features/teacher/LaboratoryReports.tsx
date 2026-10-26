import { useEffect, useState } from "react";
import { fetchAuth } from "../../lib/fetchAuth";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { FileText, Clock, Activity, CheckCircle, ExternalLink } from "lucide-react";

interface TestRowItem {
  id: string;
  testName: string;
  category: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  reportId?: string;
  reportedByName?: string;
}

export default function LaboratoryReports() {
  const user = useAuthStore((s) => s.user);
  const allRequests = useLaboratoryStore(s => s.requests);
  const allReports = useLaboratoryStore(s => s.reports);
  const fetchLaboratoryData = useLaboratoryStore(s => s.fetchLaboratoryData);

  const [universityId, setUniversityId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  useEffect(() => {
    fetchLaboratoryData();
    if (user?.id) {
      const fetchPatientInfo = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const res = await fetchAuth(`${apiUrl}/patients/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUniversityId(data.roll_number || data.employee_id || data.email || null);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchPatientInfo();
    }
  }, [fetchLaboratoryData, user?.id]);
  
  if (!user) return null;

  // Strict patient data isolation
  const isUserMatch = (patientId: string) => {
    if (!patientId) return false;
    const lower = patientId.toLowerCase();
    return (
      (user.id && lower === user.id.toLowerCase()) ||
      (universityId && lower === universityId.toLowerCase())
    );
  };

  const patientRequests = allRequests.filter(r => isUserMatch(r.patientId));
  const patientReports = allReports.filter(r => 
    isUserMatch(r.patientId) && (r.status === 'Completed' || r.status === 'Validated')
  );

  // Combine requests and finalized reports into unified rows
  const unifiedRows: TestRowItem[] = [];
  const matchedReportIds = new Set<string>();

  // Process requests first
  patientRequests.forEach((req) => {
    // Check if there is an associated finalized report
    const matchingReport = patientReports.find(
      rep => rep.requestId === req.id || 
             (rep.testName.toLowerCase() === req.testName.toLowerCase() && 
              Math.abs(new Date(rep.requestedAt || rep.completedAt || 0).getTime() - new Date(req.requestedAt).getTime()) < 86400000 * 2)
    );

    if (matchingReport) {
      matchedReportIds.add(matchingReport.id);
      unifiedRows.push({
        id: req.id,
        testName: req.testName,
        category: req.category,
        date: matchingReport.completedAt || matchingReport.validatedAt || req.requestedAt,
        status: 'Completed',
        reportId: matchingReport.id,
        reportedByName: matchingReport.reportedByName
      });
    } else {
      const normalizedStatus: 'Pending' | 'In Progress' | 'Completed' = 
        req.status === 'In Progress' ? 'In Progress' :
        req.status === 'Completed' ? 'Completed' : 'Pending';

      unifiedRows.push({
        id: req.id,
        testName: req.testName,
        category: req.category,
        date: req.requestedAt,
        status: normalizedStatus,
      });
    }
  });

  // Include any finalized reports not directly linked to a request order
  patientReports.forEach((rep) => {
    if (!matchedReportIds.has(rep.id)) {
      unifiedRows.push({
        id: rep.id,
        testName: rep.testName,
        category: rep.category,
        date: rep.completedAt || rep.validatedAt || rep.requestedAt,
        status: 'Completed',
        reportId: rep.id,
        reportedByName: rep.reportedByName
      });
    }
  });

  // Sort descending by date
  unifiedRows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredRows = filter === 'All' 
    ? unifiedRows 
    : unifiedRows.filter(r => r.status === filter);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
            <FileText size={22} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">My Laboratory Reports</h2>
            <p className="text-xs text-gray-500">Track diagnostic test progress and view finalized reports</p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === tab 
                  ? 'bg-white text-gray-900 shadow-sm font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="font-medium text-gray-700">No laboratory test records found.</p>
          <p className="text-xs text-gray-400 mt-1">
            {filter === 'All' 
              ? "When diagnostic tests are ordered, their real-time progress will appear here." 
              : `No tests currently marked as "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 bg-gray-50/70 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Test Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredRows.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{item.testName}</div>
                    {item.category && (
                      <span className="text-xs text-gray-500">{item.category}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.status === 'Completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle size={13} /> Completed
                      </span>
                    )}
                    {item.status === 'In Progress' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Activity size={13} /> In Progress
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={13} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {item.status === 'Completed' && item.reportId ? (
                      <Link 
                        to={`/reports/view/${item.reportId}`} 
                        target="_blank"
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-blue-200 hover:border-blue-600 shadow-sm"
                      >
                        <ExternalLink size={13} /> View / Download
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic font-medium px-2 py-1">
                        Not Available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
