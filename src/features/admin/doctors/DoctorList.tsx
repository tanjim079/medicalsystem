import { useState, useEffect } from "react";
import { useUserStore } from "../../../store/useUserStore";
import { Search, Mail, Phone } from "lucide-react";

export default function DoctorList() {
  const { getDoctors, fetchUsers, loading } = useUserStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers("doctor");
  }, [fetchUsers]);

  const doctors = getDoctors();
  const filteredDoctors = doctors.filter((d) => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-semibold text-lg text-gray-800">All Doctors</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center py-8">Loading doctors...</p>
        ) : filteredDoctors.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">No doctors found.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div key={doc.id} className="border border-gray-100 p-4 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow bg-gray-50/50">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                {doc.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">{doc.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Mail size={12} />
                  <span className="truncate">{doc.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <Phone size={12} />
                  <span>+880 1234 567890</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}