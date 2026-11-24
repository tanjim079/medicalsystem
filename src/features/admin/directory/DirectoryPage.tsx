import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Contact, Phone, Mail, ExternalLink } from "lucide-react";
import { useDirectoryStore, type DirectoryMember } from "../../../store/useDirectoryStore";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, SelectInput, TableSkeleton, EmptyState, ConfirmDialog, Modal, Field, TextInput, Pill, th, td,
} from "../components/ui";
import { apiRequest, errorMessage } from "../lib/adminApi";
import { toast } from "../lib/useToastStore";

type Member = DirectoryMember;

export default function DirectoryPage() {
  const { members, fetchDirectory, loading } = useDirectoryStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchDirectory(); }, [fetchDirectory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => (category === "all" || m.category === category) &&
      (!q || [m.name, m.designation, m.email, m.contact].some((v) => v && v.toLowerCase().includes(q))));
  }, [members, search, category]);

  const setMembers = (list: Member[]) => useDirectoryStore.setState({ members: list });

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiRequest(`/directory/${deleting.id}`, { method: "DELETE" });
      setMembers(members.filter((m) => m.id !== deleting.id));
      toast.success(`${deleting.name} removed from the public directory`);
      setDeleting(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public directory"
        description="Doctors and staff shown on the website's Doctors and Staff pages. Separate from login accounts."
        actions={
          <>
            <Link to="/doctors" target="_blank"><Btn variant="secondary" icon={<ExternalLink size={16} />}>View on site</Btn></Link>
            <Btn icon={<Plus size={16} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add entry</Btn>
          </>
        }
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, designation, contact…" className="flex-1" />
          <SelectInput value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-48" aria-label="Category">
            <option value="all">All ({members.length})</option>
            <option value="doctor">Doctors ({members.filter((m) => m.category === "doctor").length})</option>
            <option value="staff">Staff ({members.filter((m) => m.category === "staff").length})</option>
          </SelectInput>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Category</th>
                <th className={th}>Designation</th>
                <th className={th}>Contact</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !members.length ? <TableSkeleton cols={5} /> : filtered.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={<Contact size={22} />} title={members.length ? "No entries match" : "The directory is empty"} /></td></tr>
              ) : filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className={`${td} font-medium text-slate-900`}>{m.name}</td>
                  <td className={td}>
                    <Pill className={m.category === "doctor" ? "bg-sky-50 text-sky-700 ring-sky-600/20" : "bg-slate-100 text-slate-700 ring-slate-500/20"}>
                      {m.category === "doctor" ? "Doctor" : "Staff"}
                    </Pill>
                  </td>
                  <td className={td}>{m.designation}</td>
                  <td className={td}>
                    {m.contact && <p className="flex items-center gap-1.5 text-xs"><Phone size={12} className="text-slate-400" />{m.contact}</p>}
                    {m.email && <p className="flex items-center gap-1.5 text-xs"><Mail size={12} className="text-slate-400" />{m.email}</p>}
                    {!m.contact && !m.email && <span className="text-slate-300">—</span>}
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-0.5">
                      <IconBtn label="Edit" tone="indigo" onClick={() => { setEditing(m); setFormOpen(true); }}><Pencil size={16} /></IconBtn>
                      <IconBtn label="Delete" tone="rose" onClick={() => setDeleting(m)}><Trash2 size={16} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <MemberFormModal
        open={formOpen}
        member={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSaved={(saved, isNew) => setMembers(isNew ? [...members, saved] : members.map((m) => (m.id === saved.id ? saved : m)))}
      />
      <ConfirmDialog open={!!deleting} title="Remove from directory?" confirmLabel="Remove" loading={busy}
        message={<><strong>{deleting?.name}</strong> will no longer appear on the public website. Their login account (if any) is not affected.</>}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </div>
  );
}

type MemberFormProps = { open: boolean; member: Member | null; onClose: () => void; onSaved: (m: Member, isNew: boolean) => void };

function MemberFormModal(props: MemberFormProps) {
  if (!props.open) return null;
  return <MemberForm key={props.member?.id || "new"} {...props} />;
}

function MemberForm({ open, member, onClose, onSaved }: MemberFormProps) {
  const [form, setForm] = useState({
    name: member?.name || "", category: member?.category || "doctor", designation: member?.designation || "",
    contact: member?.contact || "", email: member?.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Enter the name";
    if (form.designation.trim().length < 2) errs.designation = "Enter the designation";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    const body = { ...form, name: form.name.trim(), designation: form.designation.trim(), contact: form.contact.trim(), email: form.email.trim() };
    try {
      const saved = member
        ? await apiRequest<Member>(`/directory/${member.id}`, { method: "PUT", json: body })
        : await apiRequest<Member>("/directory", { method: "POST", json: body });
      onSaved(saved, !member);
      toast.success(`${body.name} ${member ? "updated" : "added to the directory"}`);
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={member ? "Edit directory entry" : "Add directory entry"} footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn type="submit" form="dir-form" loading={saving}>{member ? "Save" : "Add"}</Btn>
      </>
    }>
      <form id="dir-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <Field label="Name" required error={errors.name} className="sm:col-span-2">
          {(id) => <TextInput id={id} value={form.name} onChange={set("name")} autoFocus />}
        </Field>
        <Field label="Category" required>
          {(id) => (
            <SelectInput id={id} value={form.category} onChange={set("category")}>
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
            </SelectInput>
          )}
        </Field>
        <Field label="Designation" required error={errors.designation}>
          {(id) => <TextInput id={id} value={form.designation} onChange={set("designation")} placeholder="e.g. Chief Medical Officer" />}
        </Field>
        <Field label="Phone">
          {(id) => <TextInput id={id} type="tel" value={form.contact} onChange={set("contact")} />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(id) => <TextInput id={id} type="email" value={form.email} onChange={set("email")} />}
        </Field>
      </form>
    </Modal>
  );
}
