import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users, CalendarClock, Wallet, AlertTriangle, FileText, FlaskConical, RefreshCw,
  UserPlus, Pill, Receipt, Stethoscope, CalendarCheck, ChevronRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useAdminStats, type ActivityEvent } from "./lib/useAdminStats";
import { PageHeader, Panel, StatCard, Btn, ErrorBanner, EmptyState } from "./components/ui";
import { formatCurrency, formatNumber, formatDateTime, timeAgo, ROLE_LABELS } from "./lib/format";

const AXIS_TICK = { fontSize: 11, fill: "#64748b" };

const shortDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const activityIcon: Record<ActivityEvent["type"], { icon: React.ReactNode; cls: string }> = {
  appointment: { icon: <CalendarClock size={14} />, cls: "bg-sky-50 text-sky-600" },
  prescription: { icon: <FileText size={14} />, cls: "bg-violet-50 text-violet-600" },
  bill: { icon: <Receipt size={14} />, cls: "bg-emerald-50 text-emerald-600" },
  user: { icon: <UserPlus size={14} />, cls: "bg-indigo-50 text-indigo-600" },
};

const STATUS_STYLE: Record<string, { label: string; bar: string }> = {
  pending: { label: "Pending", bar: "bg-amber-500" },
  accepted: { label: "Accepted", bar: "bg-emerald-500" },
  rejected: { label: "Rejected", bar: "bg-rose-500" },
};

export default function AdminDashboard() {
  const { stats, activity, loading, error, load } = useAdminStats();

  useEffect(() => {
    load();
  }, [load]);

  const roleData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.users.byRole)
      .map(([role, value]) => ({ role: ROLE_LABELS[role] || role, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const apptTrend = useMemo(() => (stats?.appointments.trend || []).map((d) => ({ ...d, label: shortDate(d.date) })), [stats]);
  const revenueTrend = useMemo(() => (stats?.billing.trend || []).map((d) => ({ ...d, label: shortDate(d.date) })), [stats]);
  const revenue30 = revenueTrend.reduce((s, d) => s + d.amount, 0);
  const appt14 = apptTrend.reduce((s, d) => s + d.count, 0);

  const statusTotal = stats ? Object.values(stats.appointments.byStatus).reduce((a, b) => a + b, 0) : 0;
  const first = loading && !stats;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={stats ? `System overview · updated ${timeAgo(stats.generatedAt)}` : "System overview across all modules"}
        actions={
          <Btn variant="secondary" icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />} onClick={() => load(true)} disabled={loading}>
            Refresh
          </Btn>
        }
      />

      {error && <ErrorBanner message={error} onRetry={() => load(true)} />}
      {stats && stats.warnings.length > 0 && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Some data could not be loaded: {stats.warnings.join(", ")}. Figures for those modules may be incomplete.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Registered users"
          value={formatNumber(stats?.users.total)}
          icon={<Users size={20} />}
          tone="indigo"
          loading={first}
          hint={stats && <><span className="font-medium text-emerald-600">+{stats.users.newLast30Days}</span> in the last 30 days</>}
        />
        <StatCard
          label="Appointments today"
          value={formatNumber(stats?.appointments.today)}
          icon={<CalendarClock size={20} />}
          tone="sky"
          loading={first}
          hint={stats && <>{formatNumber(stats.appointments.byStatus.pending || 0)} pending · {formatNumber(stats.appointments.total)} all-time</>}
        />
        <StatCard
          label="Revenue collected"
          value={stats ? formatCurrency(stats.billing.revenueCollected) : "—"}
          icon={<Wallet size={20} />}
          tone="emerald"
          loading={first}
          hint={stats && <>{formatCurrency(stats.billing.revenueDue)} outstanding</>}
        />
        <StatCard
          label="Low-stock medicines"
          value={formatNumber(stats?.inventory.lowStockCount)}
          icon={<AlertTriangle size={20} />}
          tone="rose"
          loading={first}
          hint={stats && <>{stats.inventory.outOfStockCount} out of stock · {formatNumber(stats.inventory.totalMedicines)} items tracked</>}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Prescriptions issued", value: stats?.clinical.prescriptions, icon: <FileText size={16} /> },
          { label: "Medical certificates", value: stats?.clinical.certificates, icon: <CalendarCheck size={16} /> },
          { label: "Lab reports", value: stats?.laboratory.reports, icon: <FlaskConical size={16} /> },
          { label: "Lab requests pending", value: stats?.laboratory.pending, icon: <FlaskConical size={16} /> },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
            <span className="text-slate-400">{m.icon}</span>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">{m.label}</p>
              <p className="text-lg font-semibold tabular-nums text-slate-900">{first ? "…" : formatNumber(m.value ?? null)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Panel
          className="xl:col-span-3"
          title="Appointments per day"
          description={`Last 14 days · ${appt14} total`}
          actions={<Link to="/admin/appointments" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all</Link>}
        >
          <div className="h-64">
            {first ? <div className="h-full animate-pulse rounded-lg bg-slate-50" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apptTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} interval="preserveStartEnd" minTickGap={12} />
                  <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v) => [v as number, "Appointments"]}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="xl:col-span-2" title="Appointment status" description="All-time breakdown">
          {first ? <div className="h-40 animate-pulse rounded-lg bg-slate-50" /> : statusTotal === 0 ? (
            <EmptyState title="No appointments yet" />
          ) : (
            <div className="space-y-4">
              <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                {Object.entries(stats!.appointments.byStatus).map(([s, n]) => (
                  <div key={s} className={`${STATUS_STYLE[s]?.bar || "bg-slate-400"} border-r-2 border-white last:border-r-0`} style={{ width: `${(n / statusTotal) * 100}%` }} title={`${s}: ${n}`} />
                ))}
              </div>
              <ul className="space-y-2.5">
                {Object.entries(stats!.appointments.byStatus).sort((a, b) => b[1] - a[1]).map(([s, n]) => (
                  <li key={s} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className={`h-2.5 w-2.5 rounded-sm ${STATUS_STYLE[s]?.bar || "bg-slate-400"}`} />
                      {STATUS_STYLE[s]?.label || s}
                    </span>
                    <span className="tabular-nums text-slate-900">
                      {formatNumber(n)} <span className="text-xs text-slate-400">({Math.round((n / statusTotal) * 100)}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
              {stats!.appointments.topDoctors.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Busiest doctors</p>
                  <ul className="space-y-2">
                    {stats!.appointments.topDoctors.slice(0, 3).map((d) => (
                      <li key={d.doctorId} className="flex items-center justify-between text-sm">
                        <span className="flex min-w-0 items-center gap-2 text-slate-700">
                          <Stethoscope size={14} className="shrink-0 text-slate-400" />
                          <span className="truncate">{d.doctorName}</span>
                        </span>
                        <span className="shrink-0 tabular-nums text-slate-500">{d.total} appts</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Panel
          className="xl:col-span-3"
          title="Revenue collected"
          description={`Last 30 days · ${formatCurrency(revenue30)}`}
          actions={<Link to="/admin/billing" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Billing</Link>}
        >
          <div className="h-64">
            {first ? <div className="h-full animate-pulse rounded-lg bg-slate-50" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} interval="preserveStartEnd" minTickGap={24} />
                  <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    formatter={(v) => [formatCurrency(v as number), "Collected"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} fill="url(#revFill)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="xl:col-span-2" title="Users by role" description={stats ? `${formatNumber(stats.users.total)} accounts` : undefined}
          actions={<Link to="/admin/users" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Manage</Link>}>
          {first ? <div className="h-48 animate-pulse rounded-lg bg-slate-50" /> : roleData.length === 0 ? (
            <EmptyState title="No users yet" />
          ) : (
            <ul className="space-y-3">
              {roleData.map((r) => {
                const max = roleData[0].value || 1;
                return (
                  <li key={r.role}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600">{r.role}</span>
                      <span className="tabular-nums text-slate-900">{formatNumber(r.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.max((r.value / max) * 100, 2)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-3" title="Recent activity" bodyClassName="p-0">
          {first ? <div className="m-5 h-48 animate-pulse rounded-lg bg-slate-50" /> : activity.length === 0 ? (
            <EmptyState title="No recent activity" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {activity.map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-5 py-3">
                  <span className={`mt-0.5 rounded-md p-1.5 ${activityIcon[e.type].cls}`}>{activityIcon[e.type].icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{e.title}</p>
                    <p className="truncate text-xs text-slate-500">{e.description}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400" title={formatDateTime(e.timestamp)}>{timeAgo(e.timestamp)}</time>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6 xl:col-span-2">
          <Panel title="Stock alerts" description={stats ? `Below ${stats.inventory.lowStockThreshold} units` : undefined} bodyClassName="p-0"
            actions={<Link to="/admin/medicines?filter=low" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Inventory</Link>}>
            {first ? <div className="m-5 h-32 animate-pulse rounded-lg bg-slate-50" /> : !stats || stats.inventory.lowStock.length === 0 ? (
              <EmptyState title="Stock levels healthy" description="No medicines are below the threshold." icon={<Pill size={20} />} />
            ) : (
              <ul className="divide-y divide-slate-100">
                {stats.inventory.lowStock.map((m) => (
                  <li key={m.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                    <span className="truncate text-slate-700">{m.name}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${m.stock <= 0 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                      {m.stock <= 0 ? "Out of stock" : `${m.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Quick actions" bodyClassName="p-2">
            {[
              { to: "/admin/users?new=1", label: "Create a user account", icon: <UserPlus size={16} /> },
              { to: "/admin/medicines?new=1", label: "Add a medicine", icon: <Pill size={16} /> },
              { to: "/admin/tests?new=1", label: "Add a lab test", icon: <FlaskConical size={16} /> },
              { to: "/admin/billing?status=Due", label: "Review outstanding bills", icon: <Receipt size={16} /> },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                <span className="text-indigo-600">{a.icon}</span>
                <span className="flex-1">{a.label}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
