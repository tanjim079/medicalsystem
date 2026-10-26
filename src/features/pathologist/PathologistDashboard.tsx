import { useEffect } from "react";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import { Activity, Clock, CheckCircle, FileText } from "lucide-react";

export default function PathologistDashboard() {
  const user = useAuthStore((s) => s.user);
  
  const requests = useLaboratoryStore((s) => s.requests);
  const reports = useLaboratoryStore((s) => s.reports);
  const fetchLaboratoryData = useLaboratoryStore((s) => s.fetchLaboratoryData);

  useEffect(() => {
    fetchLaboratoryData();
  }, [fetchLaboratoryData]);

  const pendingTests = requests.filter(r => r.status === 'Pending');
  const inProgressTests = requests.filter(r => r.status === 'In Progress');
  const finalizedReports = reports.filter(r => r.status === 'Completed' || r.status === 'Validated');
  const completedToday = finalizedReports.filter(r => {
    const reportDate = r.completedAt || r.validatedAt;
    return reportDate && new Date(reportDate).toDateString() === new Date().toDateString();
  });

  const stats = [
    { title: "Pending Tests", count: pendingTests.length, icon: <Clock size={24} className="text-yellow-500" />, bg: "bg-yellow-50", link: "/pathologist/tests" },
    { title: "In Progress", count: inProgressTests.length, icon: <Activity size={24} className="text-blue-500" />, bg: "bg-blue-50", link: "/pathologist/tests" },
    { title: "Completed Today", count: completedToday.length, icon: <CheckCircle size={24} className="text-emerald-500" />, bg: "bg-emerald-50", link: "/pathologist/reports" },
    { title: "Total Finalized Reports", count: finalizedReports.length, icon: <FileText size={24} className="text-indigo-500" />, bg: "bg-indigo-50", link: "/pathologist/reports" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Dashboard</h1>
        <p className="text-gray-500">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, idx) => (
          <Link to={s.link} key={idx} className="block group">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`${s.bg} p-3 rounded-lg`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{s.title}</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{s.count}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Test Orders */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900">Pending Test Orders</h2>
            <Link to="/pathologist/tests" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          {pendingTests.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center italic">No pending test orders right now.</p>
          ) : (
            <div className="space-y-3">
              {pendingTests.slice(0, 5).map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{test.testName}</p>
                    <p className="text-xs text-gray-500">{test.patientName} • ID: {test.patientId}</p>
                  </div>
                  <Link to={`/pathologist/tests/${test.id}`} className="text-xs bg-blue-600 text-white px-3.5 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                    Process Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Finalized Reports */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900">Recent Finalized Reports</h2>
            <Link to="/pathologist/reports" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          {finalizedReports.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center italic">No finalized reports yet.</p>
          ) : (
            <div className="space-y-3">
              {finalizedReports.slice(0, 5).map(report => (
                <div key={report.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{report.testName}</p>
                    <p className="text-xs text-gray-500">{report.patientName} • {new Date(report.completedAt || report.requestedAt).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/reports/view/${report.id}`} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-colors">
                    View Report
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
