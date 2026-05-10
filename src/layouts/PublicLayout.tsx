import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, Menu, X } from "lucide-react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Staffs", path: "/staff" },
    { name: "Tests", path: "/tests" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* 🔷 Top Contact Bar (Optional thin bar) */}
      <div className="bg-blue-600 text-white text-xs py-2 px-6 flex justify-between items-center hidden md:flex">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Phone size={14} /> +88-025888-67105</span>
          <span className="flex items-center gap-1"><Mail size={14} /> adsw@ruet.ac.bd</span>
        </div>
        <div>
          Ambulance 24/7: Call for Emergency
        </div>
      </div>

      {/* 🔷 Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-3">
          {/* <img src="/ruet-logo.png" alt="RUET Logo" className="h-10" /> */}
          <div className="bg-white text-white p-2 rounded-lg font-bold text-xl leading-none">
            <img src="/ruet-logo.png" alt="RUET Logo" className="h-9" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900 leading-tight">RUET Medical</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Healthcare Center</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === link.path ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm shadow-sm hover:bg-blue-700 hover:shadow transition-all"
          >
            Portal Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-100 py-4 px-6 flex flex-col gap-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${location.pathname === link.path ? "text-blue-600" : "text-gray-600"}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-gray-200 my-2"></div>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm text-center shadow-sm hover:bg-blue-700 transition-all"
            >
              Portal Login
            </Link>
          </div>
        )}
      </header>

      {/* 🔶 Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* 🔻 Footer */}
      <footer className="bg-[#0f172a] text-gray-300">
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
              <a href="https://www.ruet.ac.bd" target="_blank" rel="noopener" className="hover:text-white transition-colors">RUET Main Website</a>
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
