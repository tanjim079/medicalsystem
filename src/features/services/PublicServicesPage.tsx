import { Activity, Clock, Users, FileText, CheckCircle, Stethoscope, Brain, Eye, UserPlus, FileHeart, Truck } from "lucide-react";

export default function PublicServicesPage() {
  const services = [
    {
      id: 1,
      name: "Medical Service Delivery",
      icon: <Stethoscope size={32} />,
      color: "blue",
      recipients: "Students, Teachers, Officers, Staffs and Family members (University specified family members).",
      requirements: "Medical booklet for students (free treatment). Prescriptions for teachers, officers, staffs, and family members.",
      price: "Free for students. Others: Free treatment via prescription.",
      time: "8:00 AM to 9:00 PM",
    },
    {
      id: 2,
      name: "Mental Health Issue Service",
      icon: <Brain size={32} />,
      color: "indigo",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Counseling and Consultation.",
      price: "Free",
      time: "Every Sunday, Tuesday & Thursday 2:00 PM to 5:00 PM",
    },
    {
      id: 3,
      name: "Eye Disease Service",
      icon: <Eye size={32} />,
      color: "teal",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Counseling and Consultation.",
      price: "Free",
      time: "Every Wednesday 9:00 AM - 12:00 PM, Every Saturday 2:00 PM - 5:00 PM",
    },
    {
      id: 4,
      name: "Dental Disease Service",
      icon: <Activity size={32} />,
      color: "emerald",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Counseling and Consultation.",
      price: "Free",
      time: "Every Saturday, Monday, Thursday 9:00 AM to 1:00 PM",
    },
    {
      id: 5,
      name: "Physiotherapy Service",
      icon: <UserPlus size={32} />,
      color: "orange",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Counseling and Consultation.",
      price: "Free",
      time: "Every Saturday 9:00 AM to 1:00 PM",
    },
    {
      id: 6,
      name: "Pathology, ECG & Ultrasonography",
      icon: <FileHeart size={32} />,
      color: "rose",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Medical booklet for students. Money receipt/memo for others. Prescription required.",
      price: "University specified price.",
      time: "Pathology: Sat-Wed 9:00 AM - 11:00 AM (Sample Collection), Next Morning (Report). ECG & USG: Sat, Mon, Wed 9:00 AM - 11:30 AM (Test), Next Morning (Report).",
    },
    {
      id: 7,
      name: "Ambulance Service",
      icon: <Truck size={32} />,
      color: "red",
      recipients: "Students, Teachers, Officers, Staffs and Family members.",
      requirements: "Permission from any doctor.",
      price: "Free for students. Others: University specified bill system.",
      time: "Everyday / 24 Hours",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Comprehensive medical services provided by the RUET Health Complex to ensure the well-being of our campus community.
        </p>
      </div>

      <div className="space-y-8">
        {services.map((service) => {
          const colorStyles: Record<string, { bg: string, border: string, text: string, iconBg: string }> = {
            blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', iconBg: 'text-blue-600' },
            indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-900', iconBg: 'text-indigo-600' },
            teal: { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-900', iconBg: 'text-teal-600' },
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', iconBg: 'text-emerald-600' },
            orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-900', iconBg: 'text-orange-600' },
            rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', iconBg: 'text-rose-600' },
            red: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', iconBg: 'text-red-600' },
          };

          const styles = colorStyles[service.color] || colorStyles.blue;

          return (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className={`${styles.bg} px-6 py-4 flex items-center gap-4 border-b ${styles.border}`}>
                <div className={`${styles.iconBg} bg-white p-3 rounded-xl shadow-sm`}>
                  {service.icon}
                </div>
                <h2 className={`text-xl font-bold ${styles.text}`}>{service.name}</h2>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                      <Users size={16} className="text-gray-400" /> Recipients
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.recipients}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                      <FileText size={16} className="text-gray-400" /> Required Documents
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.requirements}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                      <CheckCircle size={16} className="text-gray-400" /> Price & Payment Method
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.price}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Clock size={16} className="text-gray-400" /> Service Delivery Time
                    </div>
                    <p className="text-gray-800 font-medium text-sm leading-relaxed whitespace-pre-line">{service.time}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
