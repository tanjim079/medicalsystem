import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar printHidden />

      {/* 🔶 Content */}
      <main className="flex-1 p-6 print:p-0">
        {children}
      </main>

      {/* 🔻 Footer */}
      <footer className="bg-[#0f172a] text-gray-300 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              Contact RUET Medical
            </h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Registrar, Rajshahi University of Engineering & Technology <br />
              Kazla, Rajshahi-6204, Bangladesh.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="tel:+8802588867105" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={16} className="text-blue-400" /> +88-025888-67105
              </a>
              <a href="mailto:adsw@ruet.ac.bd" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} className="text-blue-400" /> adsw@ruet.ac.bd
              </a>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              Service Hours
            </h2>
            <ul className="text-sm text-gray-400 space-y-3">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Saturday – Thursday</span>
                <span className="text-white">07:30 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Lunch Break</span>
                <span className="text-white">01:30 PM – 03:00 PM</span>
              </li>
              <li className="flex justify-between text-red-400 font-medium">
                <span>Friday</span>
                <span>Off Day</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
              <Link to="/doctors" className="hover:text-white transition-colors">Doctors List</Link>
              <Link to="/staff" className="hover:text-white transition-colors">Medical Staffs</Link>
              <Link to="/tests" className="hover:text-white transition-colors">Available Tests</Link>
              <Link to="/login" className="hover:text-white transition-colors">Staffs/Student Login</Link>
              <a href="https://www.ruet.ac.bd" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RUET Main Website</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 text-center py-5 text-sm text-gray-500">
          © {new Date().getFullYear()} RUET Medical Center. All rights reserved.
        </div>
      </footer>
    </div>
  );
}