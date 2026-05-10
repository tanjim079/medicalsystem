import { UserRound, Clock, Award } from "lucide-react";

export default function PublicDoctorsPage() {
  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Ahmed Hossain",
      specialization: "Chief Medical Officer",
      time: "10:00 AM – 2:00 PM",
      days: "Sat - Wed",
    },
    {
      id: "DOC002",
      name: "Dr. Rafid Islam",
      specialization: "General Physician",
      time: "08:00 AM – 1:00 PM",
      days: "Sun - Thu",
    },
    {
      id: "DOC003",
      name: "Dr. Farhana Yasmin",
      specialization: "Gynecologist",
      time: "11:00 AM – 4:00 PM",
      days: "Mon - Thu",
    },
    {
      id: "DOC004",
      name: "Dr. Iqbal Mahmud",
      specialization: "Cardiologist",
      time: "03:00 PM – 7:00 PM",
      days: "Sat, Mon, Wed",
    },
    {
      id: "DOC005",
      name: "Dr. Zaman Ali",
      specialization: "Dental Surgeon",
      time: "09:00 AM – 1:00 PM",
      days: "Sun - Wed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Doctors</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Meet our dedicated team of medical professionals committed to providing the best healthcare services to the RUET community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <UserRound size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-1">
                  <Award size={14} /> {doc.specialization}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> Availability</span>
              </div>
              <div className="font-semibold text-gray-800">{doc.days}</div>
              <div className="text-sm text-gray-500 mt-1">{doc.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
