import { Outlet, NavLink } from "react-router-dom";
import MainLayout from "./MainLayout";
import { LayoutDashboard, CalendarClock, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

export default function DoctorLayout() {
  const user = useAuthStore((s) => s.user);

  // Protected route logic - if not logged in or not a doctor, redirect
  if (!user || user.role !== "doctor") {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: "Dashboard", path: "/doctor", icon: <LayoutDashboard size={18} />, end: true },
    { name: "Serial Requests", path: "/doctor/requests", icon: <CalendarClock size={18} /> },
    { name: "Consultancy", path: "/doctor/consultancy", icon: <UserPlus size={18} /> },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[70vh]">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}
