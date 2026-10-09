import { useState, useEffect } from "react";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useLocation, Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import type { LaboratoryRequestStatus } from "../../types/laboratory";

export default function TestManagement() {
  const location = useLocation();
  const isReportsView = location.pathname.includes('/reports');
  
  const requests = useLaboratoryStore((s) => s.requests);
  const reports = useLaboratoryStore((s) => s.reports);
  const fetchLaboratoryData = useLaboratoryStore((s) => s.fetchLaboratoryData);

  useEffect(() => {
    fetchLaboratoryData();
  }, [fetchLaboratoryData]);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const displayData = isReportsView ? reports : requests;
  
  const filteredData = displayData.filter((item) => {
    const matchesSearch = item.patientName.toLowerCase().includes(search.toLowerCase()) || 
                          item.patientId.toLowerCase().includes(search.toLowerCase()) ||
                          item.testName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LaboratoryRequestStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Awaiting Validation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Awaiting Payment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Validated': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isReportsView ? "Laboratory Reports" : "Laboratory Test Requests"}
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by patient name, ID, or test name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500" size={18} />
          <select 
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {isReportsView ? (
              <>
                <option value="Awaiting Validation">Awaiting Validation</option>
                <option value="Awaiting Payment">Awaiting Payment</option>
                <option value="Validated">Validated</option>
                <option value="Rejected">Rejected</option>
              </>
            ) : (
              <>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 border-b font-medium">Date</th>
                <th className="p-4 border-b font-medium">ID</th>
                <th className="p-4 border-b font-medium">Patient</th>
                <th className="p-4 border-b font-medium">Test Name</th>
                <th className="p-4 border-b font-medium">Status</th>
                <th className="p-4 border-b font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No {isReportsView ? "reports" : "test requests"} found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(item.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{item.patientId}</td>
                    <td className="p-4 text-sm">
                      <div className="font-medium text-gray-900">{item.patientName}</div>
                      <div className="text-xs text-gray-500"></div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{item.testName}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-right">
                      <Link 
                        to={isReportsView ? `/reports/view/${item.id}` : `/pathologist/tests/${item.id}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs"
                      >
                        {isReportsView ? "View / Validate" : "Process Test"}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

