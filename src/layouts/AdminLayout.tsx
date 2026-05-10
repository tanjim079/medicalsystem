import { Outlet, NavLink } from "react-router-dom";
import MainLayout from "./MainLayout";
import { LayoutDashboard, Pill, Users } from "lucide-react";

export default function AdminLayout() {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} />, end: true },
    { name: "Medicines", path: "/admin/medicines", icon: <Pill size={18} /> },
    { name: "Doctors", path: "/admin/doctors", icon: <Users size={18} /> },
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}