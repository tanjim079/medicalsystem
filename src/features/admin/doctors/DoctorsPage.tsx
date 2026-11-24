import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Mail, Pencil, Stethoscope, CalendarClock, Clock, Ban, CheckCircle2, Contact } from "lucide-react";
import { useUserStore, type UserProfile } from "../../../store/useUserStore";
import { PageHeader, Btn, IconBtn, SearchInput, EmptyState, ErrorBanner, Pill, ConfirmDialog } from "../components/ui";
import UserFormModal from "../users/UserFormModal";
import { apiRequest, errorMessage } from "../lib/adminApi";
import { toast } from "../lib/useToastStore";
import { formatDateTime } from "../lib/format";

interface ApptLite { doctorId: string; date: string; status: string }

export default function DoctorsPage() {
  const { users, fetchUsers, loading, error, setUserStatus } = useUserStore();
  const [appointments, setAppointments] = useState<ApptLite[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [toggling, setToggling] = useState<UserProfile | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchUsers("doctor");
    apiRequest<ApptLite[]>("/appointments")
      .then((d) => setAppointments(d || []))
      .catch((err) => toast.error(`Workload unavailable: ${errorMessage(err)}`));
  }, [fetchUsers]);

  const doctors = useMemo(() => users.filter((u) => u.role === "doctor"), [users]);
  const today = new Date().toISOString().slice(0, 10);

  const load = useMemo(() => {
    const m: Record<string, { total: number; pending: number; today: number }> = {};
    appointments.forEach((a) => {
      const k = String(a.doctorId);
      m[k] ||= { total: 0, pending: 0, today: 0 };
      m[k].total += 1;
      if (a.status === "pending") m[k].pending += 1;
      if (a.date?.slice(0, 10) === today) m[k].today += 1;
    });
    return m;
  }, [appointments, today]);

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
  });

  const confirmToggle = async () => {
    if (!toggling) return;
    const activate = toggling.status === "disabled";
    setBusy(true);
    try {
      await setUserStatus(toggling.id, activate);
      toast.success(`${toggling.name} ${activate ? "enabled" : "disabled"}`);
      setToggling(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Doctor accounts and their current appointment workload."
        actions={
          <>
            <Link to="/admin/directory"><Btn variant="secondary" icon={<Contact size={16} />}>Public directory</Btn></Link>
            <Btn icon={<Plus size={16} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add doctor</Btn>
          </>
        }
      />

      {error && <ErrorBanner message={error} onRetry={() => fetchUsers("doctor")} />}

      <SearchInput value={search} onChange={setSearch} placeholder="Search doctors by name or email…" className="max-w-md" />

      {loading && doctors.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-white ring-1 ring-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white ring-1 ring-slate-200">
          <EmptyState
            icon={<Stethoscope size={22} />}
            title={doctors.length ? "No doctors match your search" : "No doctor accounts yet"}
            description={doctors.length ? undefined : "Add a doctor so patients can book appointments."}
            action={!doctors.length && <Btn size="sm" icon={<Plus size={14} />} onClick={() => setFormOpen(true)}>Add doctor</Btn>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => {
            const l = load[d.id] || { total: 0, pending: 0, today: 0 };
            const disabled = d.status === "disabled";
            return (
              <div key={d.id} className={`rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm ${disabled ? "opacity-70" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-base font-semibold text-sky-700">
                    {d.name.replace(/^Dr\.?\s*/i, "").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{d.name}</p>
                    <a href={`mailto:${d.email}`} className="flex items-center gap-1.5 truncate text-xs text-slate-500 hover:text-indigo-600">
                      <Mail size={12} /> {d.email}
                    </a>
                  </div>
                  {disabled
                    ? <Pill className="bg-rose-50 text-rose-700 ring-rose-600/20">Disabled</Pill>
                    : <Pill className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">Active</Pill>}
                </div>
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-slate-50 py-2.5 text-center">
                  <div><p className="text-lg font-semibold tabular-nums text-slate-900">{l.today}</p><p className="text-[11px] text-slate-500">Today</p></div>
                  <div><p className="text-lg font-semibold tabular-nums text-amber-600">{l.pending}</p><p className="text-[11px] text-slate-500">Pending</p></div>
                  <div><p className="text-lg font-semibold tabular-nums text-slate-900">{l.total}</p><p className="text-[11px] text-slate-500">All-time</p></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} /> {d.lastSignInAt ? `Last active ${formatDateTime(d.lastSignInAt)}` : "Never signed in"}
                  </p>
                  <div className="flex gap-0.5">
                    <Link to={`/admin/appointments?doctor=${encodeURIComponent(d.id)}`}>
                      <IconBtn label="View appointments" tone="indigo"><CalendarClock size={16} /></IconBtn>
                    </Link>
                    <IconBtn label="Edit" tone="indigo" onClick={() => { setEditing(d); setFormOpen(true); }}><Pencil size={16} /></IconBtn>
                    <IconBtn label={disabled ? "Enable" : "Disable"} tone={disabled ? "emerald" : "rose"} onClick={() => setToggling(d)}>
                      {disabled ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                    </IconBtn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <UserFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} user={editing} defaultRole="doctor" lockRole={!editing} />
      <ConfirmDialog
        open={!!toggling}
        title={toggling?.status === "disabled" ? "Enable doctor?" : "Disable doctor?"}
        message={toggling?.status === "disabled" ? `${toggling?.name} will be able to sign in again.` : `${toggling?.name} will not be able to sign in or manage appointments until re-enabled.`}
        confirmLabel={toggling?.status === "disabled" ? "Enable" : "Disable"}
        tone={toggling?.status === "disabled" ? "primary" : "danger"}
        loading={busy}
        onConfirm={confirmToggle}
        onCancel={() => setToggling(null)}
      />
    </div>
  );
}
