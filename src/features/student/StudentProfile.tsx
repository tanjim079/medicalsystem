import type { Patient } from "../../data/mockPatients";
import Card from "../../components/ui/Card";
import { User, Droplet, Phone, Calendar } from "lucide-react";

interface StudentProfileProps {
  patient: Patient;
}

export default function StudentProfile({ patient }: StudentProfileProps) {
  return (
    <Card>
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{patient.name}</h2>
          <p className="text-gray-500">ID: {patient.universityId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Droplet className="text-red-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Blood Group</p>
            <p className="font-semibold">{patient.bloodGroup}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Calendar className="text-green-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Age</p>
            <p className="font-semibold">{patient.age} Years</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Phone className="text-blue-500 mt-1 shrink-0" size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Personal Contact</p>
            <p className="font-medium text-gray-700 break-words">
              {patient.phone}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Phone className="text-blue-500 mt-1 shrink-0" size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Guardian Details</p>
            <p className="font-medium text-gray-700 break-words">
              {patient.guardianName} <span className="block sm:inline">({patient.guardianPhone})</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
