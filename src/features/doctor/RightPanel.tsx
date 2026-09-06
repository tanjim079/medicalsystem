import type { Patient } from "../../data/mockPatients";
import Card from "../../components/ui/Card";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { Link } from "react-router-dom";

export default function RightPanel({
  patient,
}: {
  patient: Patient | null;
}) {
  const allReports = useLaboratoryStore(s => s.reports);

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

      {/* 🔬 Lab Reports */}
      <Card>
        <h2 className="font-semibold mb-3">Recent Lab Reports</h2>
        
        {allReports.filter(r => r.patientId.toLowerCase() === patient.universityId.toLowerCase() && r.status === 'Validated').length === 0 ? (
          <div className="text-sm text-gray-500 italic">No validated reports found.</div>
        ) : (
          <div className="space-y-2">
            {allReports
              .filter(r => r.patientId.toLowerCase() === patient.universityId.toLowerCase() && r.status === 'Validated')
              .map(report => (
                <div key={report.id} className="text-sm border border-gray-100 rounded-lg p-2 bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-blue-900">{report.testName}</div>
                    <div className="text-xs text-gray-500">{new Date(report.validatedAt || '').toLocaleDateString()}</div>
                  </div>
                  <Link to={`/reports/view/${report.id}`} target="_blank" className="text-blue-600 hover:underline text-xs font-medium">View</Link>
                </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}