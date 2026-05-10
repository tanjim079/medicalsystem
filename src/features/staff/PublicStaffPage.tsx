import { Users, BadgeCheck, Phone } from "lucide-react";

export default function PublicStaffPage() {
  const staffMembers = [
    { id: "STF001", name: "Rahim Uddin", role: "Senior Nurse", contact: "+8801700000001" },
    { id: "STF002", name: "Salma Begum", role: "Nurse", contact: "+8801700000002" },
    { id: "STF003", name: "Kamal Hossain", role: "Lab Technician", contact: "+8801700000003" },
    { id: "STF004", name: "Tariqul Islam", role: "Ambulance Driver", contact: "+8801700000004" },
    { id: "OFF001", name: "Officer Ali", role: "Administrative Officer", contact: "+8801700000005" },
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
            <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium mt-2">
              <BadgeCheck size={16} /> {staff.role}
            </div>
            
            <a 
              href={`tel:${staff.contact}`} 
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm transition-colors border border-gray-200"
            >
              <Phone size={14} /> Contact
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
