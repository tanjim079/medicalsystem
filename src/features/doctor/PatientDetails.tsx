import type { Patient } from "../../types/patient";
import Card from "../../components/ui/Card";
import { User, Phone, Droplet, Calendar, ShieldCheck, Fingerprint } from "lucide-react";

export default function PatientDetails({
  patient,
}: {
  patient: Patient | null;
}) {
  if (!patient) {
    return (
      <Card className="h-full flex flex-col items-center justify-center py-16 text-gray-400 border-dashed border-2 border-gray-200">
        <User size={48} className="mb-4 text-gray-300" strokeWidth={1.5} />
        <p className="text-sm font-medium">No patient selected</p>
        <p className="text-xs text-gray-400 mt-1">Search for a patient to view details</p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group">
      {/* Premium Gradient Header Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <div className="flex items-start justify-between mb-6 mt-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{patient.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 text-blue-600 font-medium text-sm">
            <Fingerprint size={14} />
            <span>ID: {patient.universityId}</span>
          </div>
        </div>
        
        {/* Avatars or Badge Area */}
        <div className="flex gap-2">
          <div className="flex flex-col items-center justify-center bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
            <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mb-0.5">
              <Droplet size={12} className="fill-red-700" />
              Blood
            </div>
            <span className="font-bold text-lg leading-none">{patient.bloodGroup}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4">
        {/* Detail Items */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 transition-colors group-hover:border-gray-200">
          <div className="bg-blue-100 p-2 rounded-md text-blue-600">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Age</p>
            <p className="font-semibold text-gray-900">{patient.age} years</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 transition-colors group-hover:border-gray-200">
          <div className="bg-green-100 p-2 rounded-md text-green-600">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Contact</p>
            <p className="font-semibold text-gray-900">{patient.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 md:col-span-2 transition-colors group-hover:border-gray-200">
          <div className="bg-purple-100 p-2 rounded-md text-purple-600">
            <ShieldCheck size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Guardian Information</p>
            <div className="flex justify-between items-center mt-0.5">
              <p className="font-semibold text-gray-900">{patient.guardianName}</p>
              <a href={`tel:${patient.guardianPhone}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                <Phone size={12} /> {patient.guardianPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}