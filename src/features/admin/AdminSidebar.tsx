import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#0f172a] text-white p-5 space-y-4">
      <img src="/ruet-logo.png" alt="RUET Logo" className="h-25" />
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-2">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/medicines"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Medicines
        </NavLink>

        <NavLink
          to="/admin/doctors"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Doctors
        </NavLink>

      </nav>
    </aside>
  );
}