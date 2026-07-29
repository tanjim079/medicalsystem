import AppointmentRequests from "./AppointmentRequests";

export default function RequestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Serial Requests</h1>
      <p className="text-gray-600 mb-6">Manage patient appointment requests and accept/decline them here.</p>
      <AppointmentRequests />
    </div>
  );
}
