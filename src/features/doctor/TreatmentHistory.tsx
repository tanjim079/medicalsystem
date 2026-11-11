import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { History, FileText, Calendar, ExternalLink, Stethoscope } from "lucide-react";

interface TreatmentRecord {
  id?: string;
  date?: string;
  diagnosis?: string;
  doctorName?: string;
  medicines?: unknown[];
}

interface Props {
  patient: {
    name?: string;
    treatmentHistory?: TreatmentRecord[];
    visitSummary?: {
      totalVisits: number;
      lastVisit: string | null;
    };
    hasClinicalRelationship?: boolean;
  } | null;
}

export default function TreatmentHistory({ patient }: Props) {
  if (!patient) return null;

  const history = patient.treatmentHistory || [];

  return (
    <Card className="border border-gray-200/70 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <History size={18} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 tracking-tight text-base">
              Medical History & Prescriptions
            </h2>
            <p className="text-xs text-gray-500">
              Total Recorded Visits: {patient.visitSummary?.totalVisits ?? history.length} • Last Visit: {patient.visitSummary?.lastVisit || "None"}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {history.length} Record{history.length === 1 ? "" : "s"}
        </span>
      </div>

      {patient.hasClinicalRelationship === false ? (
        <div className="text-sm bg-blue-50/70 p-5 rounded-xl border border-blue-200/80 text-blue-900 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-blue-800 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            Walk-In Patient (New Consultation)
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">
            No active prior clinical relationship exists with your account. Prior medical history and laboratory reports are protected under patient privacy rules until a consultation, prescription, or certificate is initiated.
          </p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-sm text-gray-400 italic bg-gray-50/50 p-6 rounded-lg text-center border border-gray-100 border-dashed">
          No previous treatment history or prescriptions recorded for this patient.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record, i) => (
            <div
              key={record.id || i}
              className="border border-gray-100 rounded-xl p-3.5 bg-gray-50/40 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                    <FileText size={14} className="text-blue-500" />
                    {record.diagnosis || "General Consultation"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {record.date
                        ? new Date(record.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Stethoscope size={12} className="text-gray-400" />
                      {record.doctorName || "RUET Medical Officer"}
                    </span>
                  </div>
                </div>

                {record.id && (
                  <Link
                    to={`/prescription/view/${record.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors flex-shrink-0"
                  >
                    <ExternalLink size={12} /> View Rx
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
