import { Navigate } from "react-router-dom";

/**
 * @deprecated The receptionist report clearance workflow has been removed.
 * Receptionists no longer clear or approve diagnostic reports.
 * Reports become automatically available immediately upon pathologist submission.
 */
export default function ReportClearance() {
  return <Navigate to="/receptionist/billing" replace />;
}
