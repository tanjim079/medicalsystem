import type { Patient } from "../../data/mockPatients";
import { User, Droplet, Phone, Calendar } from "lucide-react";

interface StudentProfileProps {
  patient: Patient;
}

export default function StudentProfile({ patient }: StudentProfileProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-100">
        <div className="relative mb-4 group">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-5 rounded-full text-blue-600 border-2 border-white shadow-sm">
            <User size={40} className="drop-shadow-sm" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">{patient.name}</h2>
        <p className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm mt-2 border border-blue-100">ID: {patient.universityId}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group">
          <div className="bg-red-50 p-2.5 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
            <Droplet size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Blood Group</p>
            <p className="font-bold text-gray-800 text-lg">{patient.bloodGroup}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-500 group-hover:scale-110 transition-transform">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Age</p>
            <p className="font-bold text-gray-800 text-lg">{patient.age} <span className="text-sm font-normal text-gray-500">Years</span></p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:scale-110 transition-transform shrink-0">
            <Phone size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Personal Contact</p>
            <p className="font-semibold text-gray-800 break-words mt-0.5">
              {patient.phone}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
          <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-500 group-hover:scale-110 transition-transform shrink-0">
            <User size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Guardian</p>
            <p className="font-semibold text-gray-800 break-words mt-0.5">
              {patient.guardianName}
            </p>
            <p className="text-sm text-gray-500">{patient.guardianPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
