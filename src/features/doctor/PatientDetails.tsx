import type { Patient } from "../../data/mockPatients";
import Card from "../../components/ui/Card";

export default function PatientDetails({
  patient,
}: {
  patient: Patient | null;
}) {
  if (!patient) {
    return (
      <Card>
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a patient
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-semibold mb-4">Patient Summary</h2>

      <div className="space-y-2 text-sm">
        <p>
          <strong>ID:</strong> {patient.universityId}
        </p>

        <p>
          <strong>Name:</strong> {patient.name}
        </p>

        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>

        <p>
          <strong>Age:</strong> {patient.age}
        </p>

        <p>
          <strong>Blood Group:</strong>{" "}
          <span className="font-medium">{patient.bloodGroup}</span>
        </p>

        {/* 📞 Guardian Info */}
        <p>
          <strong>Guardian:</strong>{" "}
          <span className="font-medium">
            {patient.guardianName} ({patient.guardianPhone})
          </span>
        </p>
      </div>
    </Card>
  );
}