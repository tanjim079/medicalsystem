import { Outlet, NavLink, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  LayoutDashboard, Users, Stethoscope, Pill, Settings, LogOut, Menu, Bell, Search, X,
  CalendarClock, FlaskConical, Receipt, Contact, AlertTriangle, ChevronDown, ExternalLink,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Toaster } from "../features/admin/components/ui";
import { useAdminStats } from "../features/admin/lib/useAdminStats";

interface NavItem { name: string; path: string; icon: ReactNode; end?: boolean }

const NAV: { section: string; items: NavItem[] }[] = [
  { section: "Overview", items: [{ name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} />, end: true }] },
  {
    section: "People",
    items: [
      { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
      { name: "Doctors", path: "/admin/doctors", icon: <Stethoscope size={18} /> },
    ],
  },
  {
    section: "Clinical",
    items: [
      { name: "Appointments", path: "/admin/appointments", icon: <CalendarClock size={18} /> },
      { name: "Lab Test Catalog", path: "/admin/tests", icon: <FlaskConical size={18} /> },
    ],
  },
  {
    section: "Operations",
    items: [
      { name: "Medicine Inventory", path: "/admin/medicines", icon: <Pill size={18} /> },
      { name: "Billing & Revenue", path: "/admin/billing", icon: <Receipt size={18} /> },
    ],
  },
  { section: "Website", items: [{ name: "Public Directory", path: "/admin/directory", icon: <Contact size={18} /> }] },
  { section: "System", items: [{ name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> }] },
];

const ALL_ITEMS = NAV.flatMap((g) => g.items);

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, load } = useAdminStats();

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(menuRef, () => setMenuOpen(false));

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load, location.pathname]);

  // Close overlays on navigation (state adjusted during render, not in an effect)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setSidebarOpen(false);
    setNotifOpen(false);
    setMenuOpen(false);
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Access restricted</h1>
          <p className="mt-2 text-sm text-slate-500">The admin console is only available to administrator accounts.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50">Home</Link>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Sign in as admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/admin/users?q=${encodeURIComponent(q)}`);
    setQuery("");
  };

  const current =
    ALL_ITEMS.filter((i) => (i.end ? location.pathname === i.path : location.pathname.startsWith(i.path)))
      .sort((a, b) => b.path.length - a.path.length)[0] || ALL_ITEMS[0];

  const notifications = [
    stats && stats.inventory.outOfStockCount > 0 && {
      key: "oos", tone: "rose", to: "/admin/medicines?filter=out",
      title: `${stats.inventory.outOfStockCount} medicine${stats.inventory.outOfStockCount > 1 ? "s" : ""} out of stock`,
      body: "Restock to keep the pharmacy dispensing.",
    },
    stats && stats.inventory.lowStockCount - stats.inventory.outOfStockCount > 0 && {
      key: "low", tone: "amber", to: "/admin/medicines?filter=low",
      title: `${stats.inventory.lowStockCount - stats.inventory.outOfStockCount} medicine${stats.inventory.lowStockCount - stats.inventory.outOfStockCount > 1 ? "s" : ""} running low`,
      body: `Below ${stats.inventory.lowStockThreshold} units in stock.`,
    },
    stats && (stats.appointments.byStatus.pending || 0) > 0 && {
      key: "appt", tone: "sky", to: "/admin/appointments?status=pending",
      title: `${stats.appointments.byStatus.pending} appointment${stats.appointments.byStatus.pending > 1 ? "s" : ""} awaiting a doctor`,
      body: "Pending requests that have not been accepted or rejected.",
    },
    stats && stats.laboratory.pending > 0 && {
      key: "lab", tone: "violet", to: "/admin",
      title: `${stats.laboratory.pending} lab request${stats.laboratory.pending > 1 ? "s" : ""} pending`,
      body: "Awaiting sample processing or payment.",
    },
    stats && stats.billing.revenueDue > 0 && {
      key: "due", tone: "amber", to: "/admin/billing?status=Due",
      title: "Outstanding bills",
      body: `৳${stats.billing.revenueDue.toLocaleString("en-BD")} is still due.`,
    },
  ].filter(Boolean) as { key: string; tone: string; to: string; title: string; body: string }[];

  const toneDot: Record<string, string> = {
    rose: "bg-rose-500", amber: "bg-amber-500", sky: "bg-sky-500", violet: "bg-violet-500",
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="rounded-full bg-white p-1">
            <img src="/ruet-logo.png" alt="RUET" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">RUET Medical Centre</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Admin Console</p>
          </div>
          <button className="text-slate-400 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((group) => (
            <div key={group.section}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.section}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="flex-1">{item.name}</span>
                    {item.path === "/admin/medicines" && stats && stats.inventory.lowStockCount > 0 && (
                      <span className="rounded-full bg-rose-500/90 px-1.5 text-[10px] font-semibold text-white">{stats.inventory.lowStockCount}</span>
                    )}
                    {item.path === "/admin/appointments" && stats && (stats.appointments.byStatus.pending || 0) > 0 && (
                      <span className="rounded-full bg-sky-500/90 px-1.5 text-[10px] font-semibold text-white">{stats.appointments.byStatus.pending}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <ExternalLink size={18} /> View public site
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div className="hidden min-w-0 md:block">
            <p className="text-xs text-slate-400">Admin / <span className="text-slate-600">{current.name}</span></p>
          </div>

          <form onSubmit={handleSearch} className="relative ml-auto w-full max-w-xs md:ml-6">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a user by name, email or ID…"
              className="w-full rounded-lg border-0 bg-slate-100 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          <div className="flex items-center gap-1 sm:ml-auto">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label={`Notifications (${notifications.length})`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Alerts</p>
                    <button onClick={() => load(true)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Refresh</button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-slate-500">All clear — nothing needs your attention.</p>
                  ) : (
                    <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                      {notifications.map((n) => (
                        <li key={n.key}>
                          <Link to={n.to} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[n.tone]}`} />
                            <span>
                              <span className="block text-sm font-medium text-slate-800">{n.title}</span>
                              <span className="block text-xs text-slate-500">{n.body}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[140px] truncate text-sm font-medium leading-tight text-slate-800">{user.name || "Administrator"}</span>
                  <span className="block text-[11px] leading-tight text-slate-500">Administrator</span>
                </span>
                <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-slate-200">
                  <div className="border-b border-slate-100 px-4 py-2.5">
                    <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings size={16} /> Account settings
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
