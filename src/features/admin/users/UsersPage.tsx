import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Download, Pencil, KeyRound, Ban, CheckCircle2, Trash2, Eye, Users, RefreshCw } from "lucide-react";
import { useUserStore, accountTypeOf, type UserProfile } from "../../../store/useUserStore";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, SelectInput, Pagination, TableSkeleton, EmptyState, ErrorBanner,
  ConfirmDialog, Modal, Field, TextInput, Pill, th, td,
} from "../components/ui";
import UserFormModal from "./UserFormModal";
import { ROLE_OPTIONS } from "../lib/roles";
import { usePage, useQueryState } from "../lib/hooks";
import { ROLE_LABELS, ROLE_BADGE, formatDate, formatDateTime, exportCsv } from "../lib/format";
import { toast } from "../lib/useToastStore";
import { errorMessage } from "../lib/adminApi";

const PAGE_SIZE = 15;
type SortKey = "name" | "created_at" | "lastSignInAt";

export default function UsersPage() {
  const { users, fetchUsers, deleteUser, setUserStatus, resetPassword, loading, error } = useUserStore();
  const me = useAuthStore((s) => s.user);
  // Search and role live in the URL so the header search box and dashboard links can deep-link here.
  const [search, setSearch] = useQueryState("q");
  const [roleFilter, setRoleFilter] = useQueryState("role", "all");
  const [newParam, setNewParam] = useQueryState("new");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [page, setPage] = usePage(`${search}|${roleFilter}|${statusFilter}|${sort}`);

  const [formOpenLocal, setFormOpen] = useState(false);
  const formOpen = formOpenLocal || newParam === "1";
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [viewing, setViewing] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState<UserProfile | null>(null);
  const [toggling, setToggling] = useState<UserProfile | null>(null);
  const [resetting, setResetting] = useState<UserProfile | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const roleCounts = useMemo(() => {
    const c: Record<string, number> = {};
    users.forEach((u) => {
      const t = accountTypeOf(u);
      c[t] = (c[t] || 0) + 1;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = users.filter((u) => {
      const type = accountTypeOf(u);
      if (roleFilter !== "all" && type !== roleFilter) return false;
      if (statusFilter !== "all" && (u.status || "active") !== statusFilter) return false;
      if (!q) return true;
      return [u.name, u.email, u.patients?.roll_number, u.patients?.department, u.patients?.phone]
        .some((v) => v && String(v).toLowerCase().includes(q));
    });
    return list.sort((a, b) => {
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      const av = a[sort] ? new Date(a[sort] as string).getTime() : 0;
      const bv = b[sort] ? new Date(b[sort] as string).getTime() : 0;
      return bv - av;
    });
  }, [users, search, roleFilter, statusFilter, sort]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const disabledCount = users.filter((u) => u.status === "disabled").length;

  const handleExport = () => {
    exportCsv(`ruet-medical-users-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: ROLE_LABELS[accountTypeOf(u)] || accountTypeOf(u),
      Status: u.status || "active",
      "University ID": u.patients?.roll_number || "",
      Department: u.patients?.department || "",
      Phone: u.patients?.phone || "",
      "Blood group": u.patients?.blood_group || "",
      Created: u.created_at ? formatDate(u.created_at) : "",
      "Last sign-in": u.lastSignInAt ? formatDateTime(u.lastSignInAt) : "",
    })));
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteUser(deleting.id);
      toast.success(`${deleting.name} was deleted`);
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete user"));
    } finally {
      setBusy(false);
    }
  };

  const confirmToggle = async () => {
    if (!toggling) return;
    const activate = toggling.status === "disabled";
    setBusy(true);
    try {
      await setUserStatus(toggling.id, activate);
      toast.success(`${toggling.name} ${activate ? "can sign in again" : "has been disabled"}`);
      setToggling(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update account status"));
    } finally {
      setBusy(false);
    }
  };

  const isMe = (u: UserProfile) => u.id === me?.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Create accounts, assign roles, and control who can sign in."
        actions={
          <>
            <Btn variant="secondary" icon={<Download size={16} />} onClick={handleExport} disabled={filtered.length === 0}>Export CSV</Btn>
            <Btn icon={<Plus size={16} />} onClick={() => { setEditing(null); setFormOpen(true); }}>New user</Btn>
          </>
        }
      />

      {/* Role quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ value: "all", label: "All", count: users.length }, ...ROLE_OPTIONS.map((o) => ({ value: o.value, label: ROLE_LABELS[o.value], count: roleCounts[o.value] || 0 }))]
          .filter((c) => c.value === "all" || c.count > 0 || roleFilter === c.value)
          .map((c) => (
            <button
              key={c.value}
              onClick={() => setRoleFilter(c.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
                roleFilter === c.value ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {c.label} <span className={roleFilter === c.value ? "text-indigo-200" : "text-slate-400"}>{c.count}</span>
            </button>
          ))}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchUsers()} />}

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, roll number, department…" className="flex-1" />
          <div className="flex gap-2">
            <SelectInput value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" aria-label="Status filter">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled{disabledCount ? ` (${disabledCount})` : ""}</option>
            </SelectInput>
            <SelectInput value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-40" aria-label="Sort">
              <option value="name">Sort: Name</option>
              <option value="created_at">Sort: Newest</option>
              <option value="lastSignInAt">Sort: Last sign-in</option>
            </SelectInput>
            <IconBtn label="Reload" onClick={() => fetchUsers()} className="ring-1 ring-slate-200 px-2.5">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </IconBtn>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>User</th>
                <th className={th}>Role</th>
                <th className={th}>University ID</th>
                <th className={th}>Status</th>
                <th className={th}>Last sign-in</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && users.length === 0 ? (
                <TableSkeleton cols={6} />
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={<Users size={22} />}
                      title={users.length === 0 ? "No users yet" : "No users match your filters"}
                      description={users.length === 0 ? "Create the first account to get started." : "Try a different search term or clear the filters."}
                      action={users.length > 0 && (
                        <Btn variant="secondary" size="sm" onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}>Clear filters</Btn>
                      )}
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((u) => {
                  const type = accountTypeOf(u);
                  const disabled = u.status === "disabled";
                  return (
                    <tr key={u.id} className={`hover:bg-slate-50/60 ${disabled ? "opacity-70" : ""}`}>
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {u.name} {isMe(u) && <span className="ml-1 text-xs font-normal text-slate-400">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className={td}>
                        <Pill className={ROLE_BADGE[type] || ROLE_BADGE.staff}>{ROLE_LABELS[type] || type}</Pill>
                      </td>
                      <td className={`${td} tabular-nums`}>{u.patients?.roll_number || <span className="text-slate-300">—</span>}</td>
                      <td className={td}>
                        {disabled ? (
                          <Pill className="bg-rose-50 text-rose-700 ring-rose-600/20"><Ban size={12} /> Disabled</Pill>
                        ) : (
                          <Pill className="bg-emerald-50 text-emerald-700 ring-emerald-600/20"><CheckCircle2 size={12} /> Active</Pill>
                        )}
                      </td>
                      <td className={`${td} text-xs text-slate-500`}>{u.lastSignInAt ? formatDateTime(u.lastSignInAt) : "Never"}</td>
                      <td className={`${td} text-right`}>
                        <div className="flex justify-end gap-0.5">
                          <IconBtn label="View details" onClick={() => setViewing(u)}><Eye size={16} /></IconBtn>
                          <IconBtn label="Edit" tone="indigo" onClick={() => { setEditing(u); setFormOpen(true); }}><Pencil size={16} /></IconBtn>
                          <IconBtn label="Reset password" tone="amber" onClick={() => setResetting(u)}><KeyRound size={16} /></IconBtn>
                          <IconBtn
                            label={disabled ? "Enable account" : "Disable account"}
                            tone={disabled ? "emerald" : "slate"}
                            disabled={isMe(u)}
                            onClick={() => setToggling(u)}
                          >
                            {disabled ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </IconBtn>
                          <IconBtn label="Delete" tone="rose" disabled={isMe(u)} onClick={() => setDeleting(u)}><Trash2 size={16} /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
      </Panel>

      <UserFormModal open={formOpen} onClose={() => { setFormOpen(false); setNewParam(""); setEditing(null); }} user={editing} />

      <UserDetailModal user={viewing} onClose={() => setViewing(null)} onEdit={(u) => { setViewing(null); setEditing(u); setFormOpen(true); }} />

      <ResetPasswordModal user={resetting} onClose={() => setResetting(null)} onSubmit={resetPassword} />

      <ConfirmDialog
        open={!!deleting}
        title="Delete user?"
        message={<>This permanently removes <strong>{deleting?.name}</strong>'s account and sign-in. Existing clinical records (appointments, prescriptions, bills) are kept. This cannot be undone.</>}
        confirmLabel="Delete user"
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <ConfirmDialog
        open={!!toggling}
        title={toggling?.status === "disabled" ? "Enable account?" : "Disable account?"}
        message={toggling?.status === "disabled"
          ? <><strong>{toggling?.name}</strong> will be able to sign in again.</>
          : <><strong>{toggling?.name}</strong> will no longer be able to sign in. Their data is kept and you can re-enable the account at any time.</>}
        confirmLabel={toggling?.status === "disabled" ? "Enable" : "Disable"}
        tone={toggling?.status === "disabled" ? "primary" : "danger"}
        loading={busy}
        onConfirm={confirmToggle}
        onCancel={() => setToggling(null)}
      />
    </div>
  );
}

function UserDetailModal({ user, onClose, onEdit }: { user: UserProfile | null; onClose: () => void; onEdit: (u: UserProfile) => void }) {
  if (!user) return null;
  const type = accountTypeOf(user);
  const p = user.patients;
  const rows: [string, React.ReactNode][] = [
    ["Email", user.email],
    ["Role", ROLE_LABELS[type] || type],
    ["System role", user.role],
    ["Status", user.status === "disabled" ? "Disabled" : "Active"],
    ["Email verified", user.emailConfirmed == null ? "—" : user.emailConfirmed ? "Yes" : "No"],
    ["Created", formatDateTime(user.created_at)],
    ["Last sign-in", user.lastSignInAt ? formatDateTime(user.lastSignInAt) : "Never"],
  ];
  const patientRows: [string, React.ReactNode][] = p ? [
    ["University ID", p.roll_number || "—"],
    ["Registration no.", p.registration_number || "—"],
    ["Department", p.department || "—"],
    ["Phone", p.phone || "—"],
    ["Age", p.age ?? "—"],
    ["Blood group", p.blood_group || "—"],
    ["Guardian", p.guardian_name || "—"],
    ["Guardian phone", p.guardian_phone || "—"],
  ] : [];

  return (
    <Modal open onClose={onClose} title={user.name} description={ROLE_LABELS[type]} footer={
      <>
        <Btn variant="secondary" onClick={onClose}>Close</Btn>
        <Btn icon={<Pencil size={16} />} onClick={() => onEdit(user)}>Edit</Btn>
      </>
    }>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{k}</dt>
            <dd className="mt-0.5 break-words text-sm text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>
      {patientRows.length > 0 && (
        <>
          <h3 className="mb-3 mt-6 border-t border-slate-100 pt-5 text-sm font-semibold text-slate-900">Patient record</h3>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {patientRows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="mt-0.5 text-sm text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </Modal>
  );
}

type ResetProps = { user: UserProfile | null; onClose: () => void; onSubmit: (id: string, pw: string) => Promise<void> };

function ResetPasswordModal(props: ResetProps) {
  if (!props.user) return null;
  return <ResetPasswordForm key={props.user.id} {...props} />;
}

function ResetPasswordForm({ user, onClose, onSubmit }: ResetProps) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const bytes = crypto.getRandomValues(new Uint32Array(12));
    const value = Array.from(bytes, (b) => chars[b % chars.length]).join("");
    setPw(value);
    setConfirm(value);
    navigator.clipboard?.writeText(value).then(() => toast.info("Generated password copied to clipboard")).catch(() => {});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setErr("Password must be at least 8 characters");
    if (pw !== confirm) return setErr("Passwords do not match");
    if (!user) return;
    setSaving(true);
    try {
      await onSubmit(user.id, pw);
      toast.success(`Password updated for ${user.name}`);
      onClose();
    } catch (error) {
      setErr(errorMessage(error, "Could not reset password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!user} onClose={onClose} size="sm" title="Reset password" description={user?.email} footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn type="submit" form="reset-form" loading={saving}>Update password</Btn>
      </>
    }>
      <form id="reset-form" onSubmit={submit} className="space-y-4">
        <Field label="New password" error={err}>
          {(id) => <TextInput id={id} type="text" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} />}
        </Field>
        <Field label="Confirm password">
          {(id) => <TextInput id={id} type="text" autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setErr(""); }} />}
        </Field>
        <button type="button" onClick={generate} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Generate a strong password
        </button>
        <p className="text-xs text-slate-500">Share the new password with the user through a secure channel.</p>
      </form>
    </Modal>
  );
}
