import type { Patient } from "../../data/mockPatients";
import Card from "../../components/ui/Card";

export default function TreatmentHistory({
  patient,
}: {
  patient: Patient | null;
}) {
  if (!patient) return null;

  const mockHistory = [
    { date: "2026-04-20", diagnosis: "Flu", notes: "Rest + Paracetamol" },
    { date: "2026-03-10", diagnosis: "Headache", notes: "Painkiller" },
  ];

  return (
    <Card>
      <h2 className="font-semibold mb-4">Treatment History</h2>

      <div className="space-y-3">
        {mockHistory.map((h, i) => (
          <div key={i} className="border-b pb-2">
            <p className="text-sm font-medium">{h.date}</p>
            <p className="text-sm">{h.diagnosis}</p>
            <p className="text-xs text-gray-500">{h.notes}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}