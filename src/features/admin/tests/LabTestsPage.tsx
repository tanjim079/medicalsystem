import { useMemo, useState, type FormEvent } from "react";
import { useApiResource, usePage, useQueryState } from "../lib/hooks";
import { Plus, Download, Pencil, Trash2, FlaskConical } from "lucide-react";
import type { MedicalTest } from "../../../data/tests";
import { useTestStore } from "../../../store/useTestStore";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, SelectInput, Pagination, TableSkeleton, EmptyState, ErrorBanner,
  ConfirmDialog, Modal, Field, TextInput, Pill, th, td,
} from "../components/ui";
import { apiRequest, errorMessage } from "../lib/adminApi";
import { toast } from "../lib/useToastStore";
import { exportCsv, formatCurrency } from "../lib/format";

const CATEGORIES = ["Pathology", "ECG", "Ultrasonography", "Radiology", "Other"] as const;
const CAT_STYLE: Record<string, string> = {
  Pathology: "bg-violet-50 text-violet-700 ring-violet-600/20",
  ECG: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Ultrasonography: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Radiology: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Other: "bg-slate-100 text-slate-700 ring-slate-500/20",
};
const PAGE_SIZE = 20;

export default function LabTestsPage() {
  const { data, setData, loading, error, reload } = useApiResource<MedicalTest[]>("/tests", []);
  const tests = useMemo(
    () => [...data].sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true })),
    [data]
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = usePage(`${search}|${category}`);
  const [newParam, setNewParam] = useQueryState("new");
  const [formOpenLocal, setFormOpen] = useState(false);
  const formOpen = formOpenLocal || newParam === "1";
  const [editing, setEditing] = useState<MedicalTest | null>(null);
  const [deleting, setDeleting] = useState<MedicalTest | null>(null);
  const [busy, setBusy] = useState(false);

  const sync = (list: MedicalTest[]) => {
    setData(list);
    useTestStore.setState({ tests: list }); // keep receptionist/pathologist caches in sync
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tests.filter((t) => (category === "all" || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || String(t.id).toLowerCase().includes(q)));
  }, [tests, search, category]);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const catCounts = useMemo(() => {
    const c: Record<string, number> = {};
    tests.forEach((t) => { c[t.category] = (c[t.category] || 0) + 1; });
    return c;
  }, [tests]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiRequest(`/tests/${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      sync(tests.filter((t) => t.id !== deleting.id));
      toast.success(`${deleting.name} removed from the catalog`);
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
        title="Lab test catalog"
        description="Tests offered by the laboratory and their prices. Used by billing at reception."
        actions={
          <>
            <Btn variant="secondary" icon={<Download size={16} />} disabled={!filtered.length}
              onClick={() => exportCsv("lab-test-catalog.csv", filtered.map((t) => ({
                ID: t.id, Test: t.name, Category: t.category, "Student price": t.studentPrice, "Employee price": t.employeePrice,
              })))}>Export CSV</Btn>
            <Btn icon={<Plus size={16} />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add test</Btn>
          </>
        }
      />

      {error && <ErrorBanner message={error} onRetry={reload} />}

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by test name or ID…" className="flex-1" />
          <SelectInput value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-56" aria-label="Category">
            <option value="all">All categories ({tests.length})</option>
            {CATEGORIES.filter((c) => catCounts[c]).map((c) => <option key={c} value={c}>{c} ({catCounts[c]})</option>)}
          </SelectInput>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>ID</th>
                <th className={th}>Test</th>
                <th className={th}>Category</th>
                <th className={`${th} text-right`}>Student</th>
                <th className={`${th} text-right`}>Employee</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !tests.length ? <TableSkeleton cols={6} /> : rows.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={<FlaskConical size={22} />} title={tests.length ? "No tests match" : "The catalog is empty"} /></td></tr>
              ) : rows.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className={`${td} font-mono text-xs text-slate-500`}>{t.id}</td>
                  <td className={`${td} font-medium text-slate-900`}>{t.name}</td>
                  <td className={td}><Pill className={CAT_STYLE[t.category] || CAT_STYLE.Other}>{t.category}</Pill></td>
                  <td className={`${td} text-right tabular-nums`}>{formatCurrency(t.studentPrice)}</td>
                  <td className={`${td} text-right tabular-nums`}>{formatCurrency(t.employeePrice)}</td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-0.5">
                      <IconBtn label="Edit" tone="indigo" onClick={() => { setEditing(t); setFormOpen(true); }}><Pencil size={16} /></IconBtn>
                      <IconBtn label="Delete" tone="rose" onClick={() => setDeleting(t)}><Trash2 size={16} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
      </Panel>

      <TestFormModal
        open={formOpen}
        test={editing}
        existing={tests}
        onClose={() => { setFormOpen(false); setNewParam(""); setEditing(null); }}
        onSaved={(saved, isNew) => sync(isNew ? [...tests, saved] : tests.map((t) => (t.id === saved.id ? saved : t)))}
      />
      <ConfirmDialog open={!!deleting} title="Delete test?" confirmLabel="Delete" loading={busy}
        message={<>Remove <strong>{deleting?.name}</strong> from the catalog? Existing bills and reports are not affected.</>}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </div>
  );
}

type TestFormProps = {
  open: boolean; test: MedicalTest | null; existing: MedicalTest[]; onClose: () => void; onSaved: (t: MedicalTest, isNew: boolean) => void;
};

function TestFormModal(props: TestFormProps) {
  if (!props.open) return null;
  return <TestForm key={props.test?.id || "new"} {...props} />;
}

function TestForm({ open, test, existing, onClose, onSaved }: TestFormProps) {
  const [name, setName] = useState(test?.name || "");
  const [category, setCategory] = useState<string>(test?.category || "Pathology");
  const [studentPrice, setStudentPrice] = useState(test ? String(test.studentPrice) : "");
  const [employeePrice, setEmployeePrice] = useState(test ? String(test.employeePrice) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const n = name.trim();
    const price = (v: string) => v.trim() !== "" && !Number.isNaN(+v) && +v >= 0;
    if (n.length < 2) errs.name = "Enter the test name";
    else if (existing.some((t) => t.id !== test?.id && t.name.toLowerCase() === n.toLowerCase())) errs.name = "A test with this name already exists";
    if (!price(studentPrice)) errs.studentPrice = "Enter a valid price";
    if (!price(employeePrice)) errs.employeePrice = "Enter a valid price";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    const body = { name: n, category, studentPrice: +studentPrice, employeePrice: +employeePrice };
    try {
      const saved = test
        ? await apiRequest<MedicalTest>(`/tests/${encodeURIComponent(test.id)}`, { method: "PUT", json: body })
        : await apiRequest<MedicalTest>("/tests", { method: "POST", json: body });
      onSaved(saved, !test);
      toast.success(`${n} ${test ? "updated" : "added"}`);
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={test ? "Edit lab test" : "Add lab test"} description={test?.id} footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn type="submit" form="test-form" loading={saving}>{test ? "Save" : "Add test"}</Btn>
      </>
    }>
      <form id="test-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <Field label="Test name" required error={errors.name} className="sm:col-span-2">
          {(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. Lipid Profile" />}
        </Field>
        <Field label="Category" required className="sm:col-span-2">
          {(id) => (
            <SelectInput id={id} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </SelectInput>
          )}
        </Field>
        <Field label="Student price (৳)" required error={errors.studentPrice}>
          {(id) => <TextInput id={id} inputMode="decimal" value={studentPrice} onChange={(e) => setStudentPrice(e.target.value)} />}
        </Field>
        <Field label="Employee price (৳)" required error={errors.employeePrice}>
          {(id) => <TextInput id={id} inputMode="decimal" value={employeePrice} onChange={(e) => setEmployeePrice(e.target.value)} />}
        </Field>
      </form>
    </Modal>
  );
}
