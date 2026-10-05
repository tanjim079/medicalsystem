import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Pill, Users, Menu, Bell, Search, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} />, end: true },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Doctors", path: "/admin/doctors", icon: <Users size={20} /> },
    { name: "Medicines", path: "/admin/medicines", icon: <Pill size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-indigo-900 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-indigo-800">
          <div className="bg-white p-1 rounded-full">
            <img src="/ruet-logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.src='https://via.placeholder.com/32'} />
          </div>
          <span className="font-bold text-lg">RUET Medical</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-indigo-100 hover:bg-indigo-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-gray-700 leading-none">{user?.name || 'Administrator'}</p>
                <p className="text-gray-500 text-xs mt-1">{user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
}