import { useMemo, useState } from "react";
import { useApiResource, usePage, useQueryState } from "../lib/hooks";
import { Download, Check, X, Trash2, CalendarClock, RefreshCw } from "lucide-react";
import type { Appointment, AppointmentStatus } from "../../../types/appointment";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, SelectInput, TextInput, Pagination, TableSkeleton, EmptyState,
  ErrorBanner, ConfirmDialog, Pill, th, td,
} from "../components/ui";
import { apiRequest, errorMessage } from "../lib/adminApi";
import { toast } from "../lib/useToastStore";
import { exportCsv, formatDate, formatNumber } from "../lib/format";
import { useAdminStats } from "../lib/useAdminStats";

const PAGE_SIZE = 20;
const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  accepted: { label: "Accepted", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export default function AdminAppointmentsPage() {
  const refreshStats = useAdminStats((s) => s.load);
  const { data: items, setData: setItems, loading, error, reload: load } = useApiResource<Appointment[]>("/appointments", []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useQueryState("status", "all");
  const [doctor, setDoctor] = useQueryState("doctor", "all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = usePage(`${search}|${status}|${doctor}|${from}|${to}`);
  const [deleting, setDeleting] = useState<Appointment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);


  const doctors = useMemo(() => {
    const m = new Map<string, string>();
    items.forEach((a) => a.doctorId && m.set(String(a.doctorId), a.doctorName));
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => doctor === "all" || String(a.doctorId) === doctor)
      .filter((a) => (!from || a.date >= from) && (!to || a.date <= to))
      .filter((a) => !q || [a.patientName, a.patientUniversityId, a.doctorName, a.symptoms, a.serialNumber].some((v) => v && String(v).toLowerCase().includes(q)))
      .sort((a, b) => (b.date || "").localeCompare(a.date || "") || (a.time || "").localeCompare(b.time || ""));
  }, [items, search, status, doctor, from, to]);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((a) => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  }, [items]);

  const changeStatus = async (a: Appointment, next: AppointmentStatus) => {
    setBusyId(a.id);
    try {
      const updated = await apiRequest<Appointment>(`/appointments/${a.id}/status`, { method: "PUT", json: { status: next } });
      setItems((list) => list.map((x) => (x.id === a.id ? { ...x, ...updated } : x)));
      toast.success(`Appointment for ${a.patientName} ${next}`);
      refreshStats(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await apiRequest(`/appointments/${deleting.id}`, { method: "DELETE" });
      setItems((list) => list.filter((x) => x.id !== deleting.id));
      toast.success("Appointment deleted");
      setDeleting(null);
      refreshStats(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const clear = () => { setSearch(""); setStatus("all"); setDoctor("all"); setFrom(""); setTo(""); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Every appointment across all doctors. Override statuses or remove invalid bookings."
        actions={
          <>
            <Btn variant="secondary" icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />} onClick={load}>Refresh</Btn>
            <Btn variant="secondary" icon={<Download size={16} />} disabled={!filtered.length}
              onClick={() => exportCsv(`appointments-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map((a) => ({
                Date: a.date, Time: a.time, Serial: a.serialNumber || "", Patient: a.patientName, "Patient ID": a.patientUniversityId || a.patientId,
                Doctor: a.doctorName, Status: a.status, Symptoms: a.symptoms || "",
              })))}>Export CSV</Btn>
          </>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "pending", "accepted", "rejected"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${status === s ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>
            {s === "all" ? "All" : STATUS[s].label} <span className={status === s ? "text-indigo-200" : "text-slate-400"}>{formatNumber(counts[s] || 0)}</span>
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <Panel bodyClassName="p-0">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 md:grid-cols-2 xl:grid-cols-[1fr_220px_150px_150px_auto]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patient, ID, doctor, symptoms…" />
          <SelectInput value={doctor} onChange={(e) => setDoctor(e.target.value)} aria-label="Doctor">
            <option value="all">All doctors</option>
            {doctors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </SelectInput>
          <TextInput type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <TextInput type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
          <Btn variant="ghost" onClick={clear}>Clear</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Patient</th>
                <th className={th}>Doctor</th>
                <th className={th}>Symptoms</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !items.length ? <TableSkeleton cols={6} /> : rows.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={<CalendarClock size={22} />} title={items.length ? "No appointments match" : "No appointments yet"} /></td></tr>
              ) : rows.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60">
                  <td className={td}>
                    <p className="font-medium text-slate-900">{formatDate(a.date)}</p>
                    <p className="text-xs text-slate-500">{a.time}{a.serialNumber ? ` · #${a.serialNumber}` : ""}</p>
                  </td>
                  <td className={td}>
                    <p className="font-medium text-slate-900">{a.patientName}</p>
                    <p className="text-xs text-slate-500">{a.patientUniversityId || a.patientId}</p>
                  </td>
                  <td className={td}>{a.doctorName}</td>
                  <td className={`${td} max-w-[240px]`}><p className="truncate text-slate-500" title={a.symptoms}>{a.symptoms || "—"}</p></td>
                  <td className={td}><Pill className={STATUS[a.status]?.cls || STATUS.pending.cls}>{STATUS[a.status]?.label || a.status}</Pill></td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-0.5">
                      <IconBtn label="Mark accepted" tone="emerald" disabled={busyId === a.id || a.status === "accepted"} onClick={() => changeStatus(a, "accepted")}><Check size={16} /></IconBtn>
                      <IconBtn label="Mark rejected" tone="amber" disabled={busyId === a.id || a.status === "rejected"} onClick={() => changeStatus(a, "rejected")}><X size={16} /></IconBtn>
                      <IconBtn label="Delete" tone="rose" disabled={busyId === a.id} onClick={() => setDeleting(a)}><Trash2 size={16} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
      </Panel>

      <ConfirmDialog open={!!deleting} title="Delete appointment?" confirmLabel="Delete" loading={busyId === deleting?.id}
        message={<>Delete the appointment for <strong>{deleting?.patientName}</strong> with {deleting?.doctorName} on {formatDate(deleting?.date)}? The slot becomes available again.</>}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </div>
  );
}
