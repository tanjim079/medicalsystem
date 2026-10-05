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
  const awaitingValidation = reports.filter(r => r.status === 'Awaiting Validation');
  const completedToday = reports.filter(r => r.status === 'Validated').filter(r => 
    r.validatedAt && new Date(r.validatedAt).toDateString() === new Date().toDateString()
  );

  const stats = [
    { title: "Pending Tests", count: pendingTests.length, icon: <Clock size={24} className="text-yellow-500" />, bg: "bg-yellow-50", link: "/pathologist/tests" },
    { title: "In Progress", count: inProgressTests.length, icon: <Activity size={24} className="text-blue-500" />, bg: "bg-blue-50", link: "/pathologist/tests" },
    { title: "Awaiting Review", count: awaitingValidation.length, icon: <FileText size={24} className="text-purple-500" />, bg: "bg-purple-50", link: "/pathologist/reports" },
    { title: "Completed Today", count: completedToday.length, icon: <CheckCircle size={24} className="text-green-500" />, bg: "bg-green-50", link: "/pathologist/reports" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
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
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Pending Test Requests</h2>
          {pendingTests.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No pending tests right now.</p>
          ) : (
            <div className="space-y-3">
              {pendingTests.slice(0, 5).map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{test.testName}</p>
                    <p className="text-xs text-gray-500">{test.patientName} • {test.patientId}</p>
                  </div>
                  <Link to={`/pathologist/tests/${test.id}`} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 transition-colors">
                    Process Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Recent Reports (Awaiting Validation)</h2>
          {awaitingValidation.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">No reports awaiting validation.</p>
          ) : (
            <div className="space-y-3">
              {awaitingValidation.slice(0, 5).map(report => (
                <div key={report.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{report.testName}</p>
                    <p className="text-xs text-gray-500">{report.patientName} • {new Date(report.requestedAt).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/reports/view/${report.id}`} className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium hover:bg-purple-100 transition-colors">
                    Review
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



