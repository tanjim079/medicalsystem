import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePage, useQueryState } from "../lib/hooks";
import { Plus, Download, PackagePlus, Pencil, Trash2, Pill, AlertTriangle, PackageX, Boxes } from "lucide-react";
import { useMedicineStore, LOW_STOCK_THRESHOLD, type Medicine } from "../../../store/useMedicineStore";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, Pagination, TableSkeleton, EmptyState, ErrorBanner,
  ConfirmDialog, Modal, Field, TextInput, Pill as Tag, StatCard, th, td,
} from "../components/ui";
import { toast } from "../lib/useToastStore";
import { errorMessage } from "../lib/adminApi";
import { exportCsv, formatNumber } from "../lib/format";
import { useAdminStats } from "../lib/useAdminStats";

const PAGE_SIZE = 20;
type StockFilter = "all" | "low" | "out" | "ok";

const stockState = (n: number) => (n <= 0 ? "out" : n < LOW_STOCK_THRESHOLD ? "low" : "ok");

export default function MedicinesPage() {
  const { medicines, fetchMedicines, loading, error, deleteMedicine } = useMedicineStore();
  const refreshStats = useAdminStats((s) => s.load);
  const [search, setSearch] = useState("");
  const [filterParam, setFilterParam] = useQueryState("filter", "all");
  const filter = (["all", "low", "out", "ok"].includes(filterParam) ? filterParam : "all") as StockFilter;
  const setFilter = (f: StockFilter) => setFilterParam(f);
  const [newParam, setNewParam] = useQueryState("new");
  const [page, setPage] = usePage(`${search}|${filter}`);
  const [addingLocal, setAdding] = useState(false);
  const adding = addingLocal || newParam === "1";
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [restocking, setRestocking] = useState<Medicine | null>(null);
  const [deleting, setDeleting] = useState<Medicine | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const counts = useMemo(() => ({
    total: medicines.length,
    units: medicines.reduce((s, m) => s + (m.stock || 0), 0),
    low: medicines.filter((m) => stockState(m.stock) === "low").length,
    out: medicines.filter((m) => stockState(m.stock) === "out").length,
  }), [medicines]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return medicines
      .filter((m) => (filter === "all" ? true : filter === "low" ? stockState(m.stock) !== "ok" : stockState(m.stock) === filter))
      .filter((m) => !q || m.name.toLowerCase().includes(q));
  }, [medicines, search, filter]);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const afterChange = () => refreshStats(true);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteMedicine(deleting.id);
      toast.success(`${deleting.name} removed from inventory`);
      setDeleting(null);
      afterChange();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medicine inventory"
        description="Stock levels for the pharmacy. Doctors prescribe from this list."
        actions={
          <>
            <Btn variant="secondary" icon={<Download size={16} />} disabled={!filtered.length}
              onClick={() => exportCsv(`medicine-inventory-${new Date().toISOString().slice(0, 10)}.csv`,
                filtered.map((m) => ({ Medicine: m.name, Stock: m.stock, Status: { out: "Out of stock", low: "Low stock", ok: "In stock" }[stockState(m.stock)] })))}>
              Export CSV
            </Btn>
            <Btn icon={<Plus size={16} />} onClick={() => setAdding(true)}>Add medicine</Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Medicines tracked" value={formatNumber(counts.total)} icon={<Pill size={20} />} tone="indigo" loading={loading && !medicines.length} />
        <StatCard label="Units in stock" value={formatNumber(counts.units)} icon={<Boxes size={20} />} tone="sky" loading={loading && !medicines.length} />
        <StatCard label="Low stock" value={formatNumber(counts.low)} icon={<AlertTriangle size={20} />} tone="amber" loading={loading && !medicines.length} hint={`Below ${LOW_STOCK_THRESHOLD} units`} />
        <StatCard label="Out of stock" value={formatNumber(counts.out)} icon={<PackageX size={20} />} tone="rose" loading={loading && !medicines.length} />
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchMedicines} />}

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={search} onChange={setSearch} placeholder="Search medicines…" className="flex-1" />
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
            {([["all", "All"], ["low", "Needs restock"], ["out", "Out of stock"], ["ok", "Healthy"]] as [StockFilter, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={`rounded-md px-3 py-1.5 transition ${filter === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Medicine</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Stock</th>
                <th className={`${th} w-48`}>Level</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !medicines.length ? <TableSkeleton cols={5} /> : rows.length === 0 ? (
                <tr><td colSpan={5}>
                  <EmptyState icon={<Pill size={22} />} title={medicines.length ? "No medicines match" : "Inventory is empty"}
                    action={!medicines.length && <Btn size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>Add medicine</Btn>} />
                </td></tr>
              ) : rows.map((m) => {
                const s = stockState(m.stock);
                const pct = Math.min(100, (m.stock / (LOW_STOCK_THRESHOLD * 5)) * 100);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className={`${td} font-medium text-slate-900`}>{m.name}</td>
                    <td className={td}>
                      {s === "out" && <Tag className="bg-rose-50 text-rose-700 ring-rose-600/20"><PackageX size={12} /> Out of stock</Tag>}
                      {s === "low" && <Tag className="bg-amber-50 text-amber-700 ring-amber-600/20"><AlertTriangle size={12} /> Low stock</Tag>}
                      {s === "ok" && <Tag className="bg-emerald-50 text-emerald-700 ring-emerald-600/20">In stock</Tag>}
                    </td>
                    <td className={`${td} text-right font-semibold tabular-nums ${s === "ok" ? "text-slate-900" : s === "low" ? "text-amber-700" : "text-rose-700"}`}>{formatNumber(m.stock)}</td>
                    <td className={td}>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div className={`h-1.5 rounded-full ${s === "ok" ? "bg-emerald-500" : s === "low" ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${Math.max(pct, s === "out" ? 0 : 3)}%` }} />
                      </div>
                    </td>
                    <td className={`${td} text-right`}>
                      <div className="flex justify-end gap-0.5">
                        <Btn size="sm" variant="secondary" icon={<PackagePlus size={14} />} onClick={() => setRestocking(m)}>Adjust</Btn>
                        <IconBtn label="Edit" tone="indigo" onClick={() => setEditing(m)}><Pencil size={16} /></IconBtn>
                        <IconBtn label="Delete" tone="rose" onClick={() => setDeleting(m)}><Trash2 size={16} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
      </Panel>

      <MedicineFormModal open={adding || !!editing} medicine={editing} onClose={() => { setAdding(false); setNewParam(""); setEditing(null); }} onSaved={afterChange} />
      <AdjustStockModal medicine={restocking} onClose={() => setRestocking(null)} onSaved={afterChange} />
      <ConfirmDialog open={!!deleting} title="Delete medicine?" confirmLabel="Delete" loading={busy}
        message={<>Remove <strong>{deleting?.name}</strong> from the inventory? Doctors will no longer be able to prescribe it from the list.</>}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </div>
  );
}

type MedFormProps = { open: boolean; medicine: Medicine | null; onClose: () => void; onSaved: () => void };

function MedicineFormModal(props: MedFormProps) {
  if (!props.open) return null;
  return <MedicineForm key={props.medicine?.id || "new"} {...props} />;
}

function MedicineForm({ open, medicine, onClose, onSaved }: MedFormProps) {
  const { addMedicine, updateMedicine, medicines } = useMedicineStore();
  const [name, setName] = useState(medicine?.name || "");
  const [stock, setStock] = useState(String(medicine?.stock ?? 0));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const n = name.trim();
    if (n.length < 2) errs.name = "Enter the medicine name";
    else if (medicines.some((m) => m.id !== medicine?.id && m.name.toLowerCase() === n.toLowerCase())) errs.name = "This medicine already exists";
    if (!/^\d+$/.test(stock)) errs.stock = "Enter a whole number, 0 or more";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      if (medicine) {
        const patch: { name?: string; stock?: number } = {};
        if (n !== medicine.name) patch.name = n;
        if (+stock !== medicine.stock) patch.stock = +stock;
        if (Object.keys(patch).length) await updateMedicine(medicine.id, patch);
        toast.success(`${n} updated`);
      } else {
        await addMedicine(n, +stock);
        toast.success(`${n} added to inventory`);
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" title={medicine ? "Edit medicine" : "Add medicine"} footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn type="submit" form="med-form" loading={saving}>{medicine ? "Save" : "Add medicine"}</Btn>
      </>
    }>
      <form id="med-form" onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Medicine name" required error={errors.name} hint="Include strength and form, e.g. Napa 500mg Tablet">
          {(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} autoFocus />}
        </Field>
        <Field label={medicine ? "Stock (units)" : "Opening stock (units)"} required error={errors.stock}>
          {(id) => <TextInput id={id} inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />}
        </Field>
      </form>
    </Modal>
  );
}

type AdjustProps = { medicine: Medicine | null; onClose: () => void; onSaved: () => void };

function AdjustStockModal(props: AdjustProps) {
  if (!props.medicine) return null;
  return <AdjustStockForm key={props.medicine.id} {...props} medicine={props.medicine} />;
}

function AdjustStockForm({ medicine, onClose, onSaved }: AdjustProps & { medicine: Medicine }) {
  const adjustStock = useMedicineStore((s) => s.adjustStock);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [qty, setQty] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const n = /^\d+$/.test(qty) ? +qty : 0;
  const next = mode === "add" ? medicine.stock + n : medicine.stock - n;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (n <= 0) return setErr("Enter a quantity greater than 0");
    if (next < 0) return setErr(`Only ${medicine.stock} units are in stock`);
    setSaving(true);
    try {
      await adjustStock(medicine.id, mode === "add" ? n : -n);
      toast.success(`${medicine.name}: ${mode === "add" ? "+" : "−"}${n} units (now ${next})`);
      onSaved();
      onClose();
    } catch (error) {
      setErr(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="sm" title="Adjust stock" description={medicine.name} footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={saving}>Cancel</Btn>
        <Btn type="submit" form="adjust-form" loading={saving} variant={mode === "add" ? "success" : "danger"}>
          {mode === "add" ? "Add stock" : "Remove stock"}
        </Btn>
      </>
    }>
      <form id="adjust-form" onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
          {(["add", "remove"] as const).map((m) => (
            <button type="button" key={m} onClick={() => setMode(m)}
              className={`rounded-md py-1.5 ${mode === m ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>
              {m === "add" ? "Restock (+)" : "Write off (−)"}
            </button>
          ))}
        </div>
        <Field label="Quantity" error={err}>
          {(id) => <TextInput id={id} inputMode="numeric" value={qty} onChange={(e) => { setQty(e.target.value); setErr(""); }} autoFocus placeholder="e.g. 100" />}
        </Field>
        <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-500">Current <strong className="text-slate-900 tabular-nums">{medicine.stock}</strong></span>
          <span className="text-slate-500">After <strong className={`tabular-nums ${next < 0 ? "text-rose-600" : "text-slate-900"}`}>{next}</strong></span>
        </div>
      </form>
    </Modal>
  );
}
