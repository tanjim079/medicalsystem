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

interface LaboratoryReportsProps {
  patientUniversityId?: string | null;
}

export default function LaboratoryReports({ patientUniversityId }: LaboratoryReportsProps = {}) {
  const user = useAuthStore((s) => s.user);
  const allRequests = useLaboratoryStore(s => s.requests);
  const allReports = useLaboratoryStore(s => s.reports);
  const fetchLaboratoryData = useLaboratoryStore(s => s.fetchLaboratoryData);

  const [universityId, setUniversityId] = useState<string | null>(patientUniversityId || null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');

  useEffect(() => {
    if (patientUniversityId) {
      setUniversityId(patientUniversityId);
    }
  }, [patientUniversityId]);

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
    const lower = patientId.toLowerCase().trim();
    const uId = user?.id?.toLowerCase().trim();
    const univId = (universityId || patientUniversityId)?.toLowerCase().trim();
    const uEmail = user?.email?.toLowerCase().trim();
    return (
      (uId && lower === uId) ||
      (univId && lower === univId) ||
      (uEmail && lower === uEmail)
    );
  };

  const patientRequests = allRequests.filter(r => isUserMatch(r.patientId));
  const patientReports = allReports.filter(r => 
    isUserMatch(r.patientId) && (r.status === 'Completed' || r.status === 'Validated')
  );

  // Combine requests and finalized reports into deduplicated unified rows
  const unifiedRows: TestRowItem[] = [];
  const fulfilledRequestIds = new Set<string>();
  const fulfilledReportIds = new Set<string>();

  // 1. Process all finalized reports first (each completed report appears exactly ONCE)
  patientReports.forEach((rep) => {
    if (fulfilledReportIds.has(rep.id)) return;
    fulfilledReportIds.add(rep.id);

    if (rep.requestId) {
      fulfilledRequestIds.add(rep.requestId);
    }

    unifiedRows.push({
      id: rep.id,
      testName: rep.testName,
      category: rep.category || 'Pathology',
      date: rep.completedAt || rep.validatedAt || rep.requestedAt || (rep as any).date || new Date().toISOString(),
      status: 'Completed',
      reportId: rep.id,
      reportedByName: rep.reportedByName
    });
  });

  // 2. Process pending / in-progress requests that don't already have a finalized report
  const seenPendingKeys = new Set<string>();

  patientRequests.forEach((req) => {
    // Skip if already fulfilled by report requestId
    if (fulfilledRequestIds.has(req.id)) return;

    // Check if this test was already fulfilled by an existing finalized report within 2 days
    const isAlreadyFulfilled = patientReports.some(rep => {
      if (rep.requestId === req.id) return true;
      if (rep.testName.toLowerCase() === req.testName.toLowerCase()) {
        const repTime = new Date(rep.requestedAt || rep.completedAt || (rep as any).date || 0).getTime();
        const reqTime = new Date(req.requestedAt).getTime();
        return Math.abs(repTime - reqTime) < 86400000 * 2;
      }
      return false;
    });

    if (isAlreadyFulfilled) return;

    // Deduplicate multiple identical pending requests on the same day
    const reqDateStr = req.requestedAt ? new Date(req.requestedAt).toISOString().split('T')[0] : '';
    const pendingKey = `${req.testName.toLowerCase()}_${reqDateStr}`;
    if (seenPendingKeys.has(pendingKey)) return;
    seenPendingKeys.add(pendingKey);

    const normalizedStatus: 'Pending' | 'In Progress' | 'Completed' = 
      req.status === 'In Progress' ? 'In Progress' :
      req.status === 'Completed' ? 'Completed' : 'Pending';

    unifiedRows.push({
      id: req.id,
      testName: req.testName,
      category: req.category || 'Pathology',
      date: req.requestedAt,
      status: normalizedStatus,
    });
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
