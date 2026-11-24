import { useEffect, useMemo, useState } from "react";
import { usePage, useQueryState } from "../lib/hooks";
import { Download, Wallet, Clock, Receipt, CheckCircle2, RefreshCw, Eye, Undo2 } from "lucide-react";
import { useBillingStore, type Bill } from "../../../store/useBillingStore";
import {
  PageHeader, Panel, Btn, IconBtn, SearchInput, SelectInput, TextInput, Pagination, TableSkeleton, EmptyState,
  StatCard, Pill, Modal, ConfirmDialog, th, td,
} from "../components/ui";
import { toast } from "../lib/useToastStore";
import { errorMessage } from "../lib/adminApi";
import { exportCsv, formatCurrency, formatDateTime, formatNumber } from "../lib/format";
import { useAdminStats } from "../lib/useAdminStats";

const PAGE_SIZE = 20;

export default function BillingPage() {
  const { bills, fetchBills, updateBillStatus, loading } = useBillingStore();
  const refreshStats = useAdminStats((s) => s.load);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useQueryState("status", "all");
  const [method, setMethod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = usePage(`${search}|${status}|${method}|${from}|${to}`);
  const [viewing, setViewing] = useState<Bill | null>(null);
  const [toggling, setToggling] = useState<Bill | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bills
      .filter((b) => status === "all" || b.status === status)
      .filter((b) => method === "all" || b.paymentMethod === method)
      .filter((b) => {
        const d = (b.date || "").slice(0, 10);
        return (!from || d >= from) && (!to || d <= to);
      })
      .filter((b) => !q || [b.id, b.patientName, b.patientId].some((v) => v && String(v).toLowerCase().includes(q)));
  }, [bills, search, status, method, from, to]);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totals = useMemo(() => filtered.reduce((t, b) => {
    const amt = Number(b.totalAmount) || 0;
    if (b.status === "Paid") t.paid += amt; else t.due += amt;
    t.discount += Number(b.discount) || 0;
    return t;
  }, { paid: 0, due: 0, discount: 0 }), [filtered]);

  const confirmToggle = async () => {
    if (!toggling) return;
    const next = toggling.status === "Paid" ? "Due" : "Paid";
    setBusy(true);
    try {
      const ok = await updateBillStatus(toggling.id, next);
      if (!ok) throw new Error("Could not update the bill status");
      toast.success(`Bill ${toggling.id} marked ${next.toLowerCase()}`);
      setToggling(null);
      refreshStats(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & revenue"
        description="All laboratory bills issued at reception."
        actions={
          <>
            <Btn variant="secondary" icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />} onClick={fetchBills}>Refresh</Btn>
            <Btn variant="secondary" icon={<Download size={16} />} disabled={!filtered.length}
              onClick={() => exportCsv(`bills-${new Date().toISOString().slice(0, 10)}.csv`, filtered.map((b) => ({
                "Bill ID": b.id, Date: formatDateTime(b.date), Patient: b.patientName, "Patient ID": b.patientId,
                Tests: (b.tests || []).map((t) => t.name).join("; "), Subtotal: b.subTotal, Discount: b.discount, Tax: b.tax,
                Total: b.totalAmount, Method: b.paymentMethod, Status: b.status,
              })))}>Export CSV</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatCurrency(totals.paid)} icon={<Wallet size={20} />} tone="emerald" loading={loading && !bills.length} hint="For the current filters" />
        <StatCard label="Outstanding" value={formatCurrency(totals.due)} icon={<Clock size={20} />} tone="amber" loading={loading && !bills.length} hint={`${filtered.filter((b) => b.status === "Due").length} unpaid bills`} />
        <StatCard label="Bills" value={formatNumber(filtered.length)} icon={<Receipt size={20} />} tone="indigo" loading={loading && !bills.length} hint={`${formatCurrency(totals.discount)} in discounts`} />
      </div>

      <Panel bodyClassName="p-0">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 md:grid-cols-3 xl:grid-cols-[1fr_140px_170px_150px_150px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search bill ID or patient…" className="md:col-span-3 xl:col-span-1" />
          <SelectInput value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="all">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </SelectInput>
          <SelectInput value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Payment method">
            <option value="all">All methods</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Mobile Banking</option>
          </SelectInput>
          <TextInput type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <TextInput type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Bill</th>
                <th className={th}>Patient</th>
                <th className={th}>Tests</th>
                <th className={th}>Method</th>
                <th className={`${th} text-right`}>Total</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !bills.length ? <TableSkeleton cols={7} /> : rows.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={<Receipt size={22} />} title={bills.length ? "No bills match" : "No bills yet"} /></td></tr>
              ) : rows.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60">
                  <td className={td}>
                    <p className="font-mono text-xs font-medium text-slate-900">{b.id}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(b.date)}</p>
                  </td>
                  <td className={td}>
                    <p className="font-medium text-slate-900">{b.patientName}</p>
                    <p className="text-xs text-slate-500">{b.patientId}</p>
                  </td>
                  <td className={`${td} max-w-[220px]`}><p className="truncate text-slate-500">{(b.tests || []).map((t) => t.name).join(", ") || "—"}</p></td>
                  <td className={td}>{b.paymentMethod}</td>
                  <td className={`${td} text-right font-semibold tabular-nums text-slate-900`}>{formatCurrency(b.totalAmount)}</td>
                  <td className={td}>
                    {b.status === "Paid"
                      ? <Pill className="bg-emerald-50 text-emerald-700 ring-emerald-600/20"><CheckCircle2 size={12} /> Paid</Pill>
                      : <Pill className="bg-amber-50 text-amber-700 ring-amber-600/20"><Clock size={12} /> Due</Pill>}
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-0.5">
                      <IconBtn label="View bill" onClick={() => setViewing(b)}><Eye size={16} /></IconBtn>
                      {b.status === "Due"
                        ? <Btn size="sm" variant="success" onClick={() => setToggling(b)}>Mark paid</Btn>
                        : <IconBtn label="Revert to due" tone="amber" onClick={() => setToggling(b)}><Undo2 size={16} /></IconBtn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPage={setPage} />
      </Panel>

      {viewing && (
        <Modal open onClose={() => setViewing(null)} title={`Bill ${viewing.id}`} description={formatDateTime(viewing.date)}
          footer={<Btn variant="secondary" onClick={() => setViewing(null)}>Close</Btn>}>
          <div className="mb-4 flex justify-between text-sm">
            <div><p className="text-xs text-slate-400">Patient</p><p className="font-medium text-slate-900">{viewing.patientName}</p><p className="text-xs text-slate-500">{viewing.patientId}</p></div>
            <div className="text-right"><p className="text-xs text-slate-400">Payment</p><p className="font-medium text-slate-900">{viewing.paymentMethod}</p><p className="text-xs text-slate-500">{viewing.status}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {(viewing.tests || []).map((t, i) => (
                <tr key={`${t.id}-${i}`}><td className="py-2 text-slate-700">{t.name}</td><td className="py-2 text-right tabular-nums">{formatCurrency(t.price)}</td></tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-200 text-slate-600">
              <tr><td className="pt-3">Subtotal</td><td className="pt-3 text-right tabular-nums">{formatCurrency(viewing.subTotal)}</td></tr>
              <tr><td>Discount</td><td className="text-right tabular-nums">−{formatCurrency(viewing.discount)}</td></tr>
              <tr><td>Tax</td><td className="text-right tabular-nums">{formatCurrency(viewing.tax)}</td></tr>
              <tr className="font-semibold text-slate-900"><td className="pt-2">Total</td><td className="pt-2 text-right tabular-nums">{formatCurrency(viewing.totalAmount)}</td></tr>
            </tfoot>
          </table>
        </Modal>
      )}

      <ConfirmDialog open={!!toggling} loading={busy}
        title={toggling?.status === "Due" ? "Mark bill as paid?" : "Revert bill to due?"}
        tone={toggling?.status === "Due" ? "primary" : "danger"}
        confirmLabel={toggling?.status === "Due" ? "Mark paid" : "Revert to due"}
        message={<>Bill <strong>{toggling?.id}</strong> for {toggling?.patientName} ({formatCurrency(toggling?.totalAmount)}).</>}
        onConfirm={confirmToggle} onCancel={() => setToggling(null)} />
    </div>
  );
}
