import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import { mockPatients } from "../../data/mockPatients";
import { users } from "../../data/users";

export default function AppointmentManagement() {
  const appointments = useAppointmentStore((s) => s.appointments);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const updateAppointmentStatus = useAppointmentStore((s) => s.updateAppointmentStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const doctors = users.filter((u) => u.role === "doctor");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    const patient = mockPatients.find((p) => p.universityId.toLowerCase() === patientId.toLowerCase());
    if (!patient) {
      alert("Patient not found!");
      return;
    }

    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      alert("Please select a valid doctor!");
      return;
    }

    // Generate a simple token number like T-12
    // eslint-disable-next-line react-hooks/purity
    const token = `T-${Date.now() % 100}`;

    addAppointment({
      patientId: patient.universityId,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      symptoms,
      tokenNumber: token,
    });

    setIsModalOpen(false);
    setPatientId("");
    setDoctorId("");
    setDate("");
    setTime("");
    setSymptoms("");
    alert(`Appointment created successfully! Token: ${token}`);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-600">Schedule and manage clinic appointments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          New Appointment
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Token</th>
                <th className="p-4 font-semibold">Patient</th>
                <th className="p-4 font-semibold">Doctor</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
                        {app.tokenNumber || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{app.patientName}</td>
                    <td className="p-4 text-gray-600">{app.doctorName}</td>
                    <td className="p-4 text-gray-600">{app.date} at {app.time}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                        ${app.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                        ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
                        ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {app.status === 'pending' && (
                          <button 
                            onClick={() => updateAppointmentStatus(app.id, 'accepted')}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                        {app.status === 'pending' && (
                          <button 
                            onClick={() => updateAppointmentStatus(app.id, 'rejected')}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        )}
                        {app.status !== 'pending' && (
                          <span className="text-xs text-gray-400">Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Appointment</h2>
            
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <Input 
                  required 
                  placeholder="e.g. 2204001" 
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select 
                  aria-label="Select Doctor"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option value="">Select a Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    aria-label="Date"
                    type="date" 
                    required 
                    className="w-full border rounded-lg px-3 py-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    aria-label="Time"
                    type="time" 
                    required 
                    className="w-full border rounded-lg px-3 py-2"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms/Notes</label>
                <textarea 
                  aria-label="Symptoms or Notes"
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Appointment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </MainLayout>
  );
}
