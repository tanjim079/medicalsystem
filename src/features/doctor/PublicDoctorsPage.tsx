import { UserRound, Phone, Mail, Award } from "lucide-react";

export default function PublicDoctorsPage() {
  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Md. Azizul Islam",
      specialization: "Chief Medical Officer (In-charge)",
      mobile: "01712-637265",
      email: "drazizul.ruet@gmail.com",
    },
    {
      id: "DOC002",
      name: "Dr. Farhana Rahman",
      specialization: "Senior Medical Officer",
      mobile: "01715204378",
      email: "farhanarahman.r4@gmail.com",
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
            
            <div className="bg-gray-50 rounded-xl p-4 mt-6 space-y-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                  <Phone size={16} className="text-gray-400" /> <span>Mobile</span>
                </div>
                <div className="font-semibold text-gray-800"><a href={`tel:${doc.mobile}`} className="hover:text-blue-600 transition-colors">{doc.mobile}</a></div>
              </div>
              
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                  <Mail size={16} className="text-gray-400" /> <span>Email</span>
                </div>
                <div className="text-sm font-semibold text-gray-800 break-all"><a href={`mailto:${doc.email}`} className="hover:text-blue-600 transition-colors">{doc.email}</a></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
