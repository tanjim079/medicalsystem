import type { Patient } from "../../data/mockPatients";
import Card from "../../components/ui/Card";

export default function RightPanel({
  patient,
}: {
  patient: Patient | null;
}) {
  if (!patient) {
    return (
      <Card>
        <div className="text-gray-500 text-sm">
          No patient selected
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      


      {/* 🩸 Basic Info */}
      <Card>
        <h2 className="font-semibold mb-3">Patient Info</h2>

        <div className="text-sm space-y-1">
          <p>
            <strong>Blood Group:</strong> {patient.bloodGroup}
          </p>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
        </div>
      </Card>

      {/* 📞 Emergency Contact */}
      <Card>
        <h2 className="font-semibold mb-3">Emergency Contact</h2>

        <div className="text-sm text-gray-700">
          <p>Name: {patient.guardianName}</p>
          <p>Phone: {patient.guardianPhone}</p>
        </div>
      </Card>

      {/* 📊 Quick Stats (mock) */}
      <Card>
        <h2 className="font-semibold mb-3">Visit Summary</h2>

        <div className="text-sm text-gray-700 space-y-1">
          <p>Last Visit: 20 Apr 2026</p>
          <p>Total Visits: 5</p>
        </div>
      </Card>

    </div>
  );
}