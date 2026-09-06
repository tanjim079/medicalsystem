import { useAuthStore } from "../../store/useAuthStore";
import { UserCircle, Mail, Phone, MapPin, Briefcase } from "lucide-react";

export default function PathologistProfile() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar & Basic Info */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-5">
              <div className="bg-white p-2 rounded-full shadow-md">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <UserCircle size={64} />
                </div>
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 font-medium capitalize">{user.role}</p>
              </div>
            </div>
            <button className="mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Professional Information</h3>
              
              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Department</p>
                  <p className="text-sm text-gray-900 font-medium">Pathology & Laboratory Medicine</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCircle className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Employee ID</p>
                  <p className="text-sm text-gray-900 font-medium">{user.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Contact Information</h3>
              
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900 font-medium">{user.id.toLowerCase()}@ruet.ac.bd</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm text-gray-900 font-medium">+880 1700-000000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Office Location</p>
                  <p className="text-sm text-gray-900 font-medium">RUET Medical Center, Room 102</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
