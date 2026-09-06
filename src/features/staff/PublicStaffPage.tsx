import { Users, BadgeCheck, Phone, Mail } from "lucide-react";

export default function PublicStaffPage() {
  const staffMembers = [
    { id: "STF001", name: "Md. Joynal Abedin", role: "Senior Principal Medical Technologist", contact: "01717-725675", email: "" },
    { id: "STF002", name: "Mst. Sultana Parvin", role: "Principal Staff Nurse", contact: "01731913528", email: "" },
    { id: "STF003", name: "Md. Saroar Jahan", role: "Assistant Principal Medical Technologist (Pharmacy)", contact: "01733368146", email: "" },
    { id: "STF004", name: "Most. Razia Khatun", role: "Staff Nurse", contact: "01775609846", email: "" },
    { id: "STF005", name: "Md. Amirul Islam", role: "MLSS", contact: "01984584010", email: "" },
    { id: "STF006", name: "Md. Altab Hossain", role: "Assistant Principal Medical Technologist (Path.)", contact: "01716472060", email: "" },
    { id: "STF007", name: "Lovely Ara", role: "Assistant Cook", contact: "01751621531", email: "" },
  ];

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
        {staffMembers.map((staff) => (
          <div key={staff.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={36} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
            <div className="flex items-center justify-center gap-1 text-indigo-600 text-sm font-medium mt-2">
              <BadgeCheck size={16} /> {staff.role}
            </div>

            <div className="w-full bg-gray-50 rounded-xl p-4 mt-6 text-left space-y-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                  <Phone size={16} className="text-gray-400" /> <span>Mobile</span>
                </div>
                <div className="font-semibold text-gray-800"><a href={`tel:${staff.contact}`} className="hover:text-indigo-600 transition-colors">{staff.contact}</a></div>
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
        ))}
      </div>
    </div>
  );
}
