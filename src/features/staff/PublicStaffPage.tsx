import { useEffect } from "react";
import { Users, BadgeCheck, Phone, Mail } from "lucide-react";
import { useDirectoryStore } from "../../store/useDirectoryStore";

export default function PublicStaffPage() {
  const { members, fetchDirectory, loading } = useDirectoryStore();

  useEffect(() => {
    fetchDirectory('staff');
  }, [fetchDirectory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
          <Users size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Staffs</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our support Staffs works tirelessly behind the scenes to ensure you receive prompt and excellent care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 col-span-3 text-center">Loading staff directory...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">No staff members found.</p>
        ) : (
          members.map((staff) => (
          <div key={staff.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={36} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
            <div className="flex items-center justify-center gap-1 text-indigo-600 text-sm font-medium mt-2">
              <BadgeCheck size={16} /> {staff.designation}
            </div>

            <div className="w-full bg-gray-50 rounded-xl p-4 mt-6 text-left space-y-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                  <Phone size={16} className="text-gray-400" /> <span>Mobile</span>
                </div>
                <div className="font-semibold text-gray-800"><a href={`tel:${staff.contact}`} className="hover:text-indigo-600 transition-colors">{staff.contact || 'N/A'}</a></div>
              </div>

              {staff.email && (
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                    <Mail size={16} className="text-gray-400" /> <span>Email</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800 break-all"><a href={`mailto:${staff.email}`} className="hover:text-indigo-600 transition-colors">{staff.email}</a></div>
                </div>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
