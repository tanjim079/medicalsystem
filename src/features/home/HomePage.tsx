import { Link } from "react-router-dom";
import { ArrowRight, Activity, Clock, ShieldPlus, Users, PhoneCall } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 🔷 Hero Section */}
      <section className="bg-blue-600 text-white pt-20 pb-24 px-6 relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-50">
              <Activity size={16} /> <span>RUET On-Campus Healthcare</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Caring for our <br />
              <span className="text-blue-200">Campus Community</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
              Providing primary and basic healthcare facilities to students and Staffs free of charge. Your health and well-being are our top priority.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all flex items-center gap-2"
              >
                Access Portal <ArrowRight size={18} />
              </Link>
              <Link
                to="/doctors"
                className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold border border-blue-500 hover:bg-blue-800 transition-all"
              >
                Find a Doctor
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-sm shadow-2xl">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-200" /> Emergency Ambulance
              </h3>
              <p className="text-blue-100 mb-6 text-sm">
                Our ambulance service is available 24/7 for students and Staffs on campus. Please contact the on-duty doctor for immediate assistance.
              </p>
              <div className="bg-white text-blue-900 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Call Now</p>
                  <p className="font-semibold text-lg">+88-025888-67105</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <PhoneCall size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔷 Quick Navigation Cards */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the comprehensive medical services available at RUET Medical Center.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldPlus size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Specialist Doctors</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Access a team of experienced and dedicated doctors for consultations, primary care, and specialized medical advice.
              </p>
              <Link to="/doctors" className="text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Doctors <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medical Staffs</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                Our supportive nursing and administrative Staffs ensure smooth operations and excellent patient care at all times.
              </p>
              <Link to="/staff" className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Meet the Staffs <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diagnostic Tests</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                We offer a range of essential medical tests and diagnostic services right here on campus for your convenience.
              </p>
              <Link to="/tests" className="text-teal-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View Available Tests <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
