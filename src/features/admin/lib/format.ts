export const formatCurrency = (n: number | null | undefined) =>
  `৳${(Number(n) || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatNumber = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : Number(n).toLocaleString("en-BD");

export const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const timeAgo = (value?: string | null) => {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diff)) return "";
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
};

/** Download rows as a CSV file (Excel-compatible, UTF-8 BOM). */
export function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  officer: "Officer",
  patient: "Patient",
  doctor: "Doctor",
  receptionist: "Receptionist",
  pathologist: "Pathologist",
  pharmacist: "Pharmacist",
  staff: "Staff",
  admin: "Admin",
};

export const ROLE_BADGE: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700 ring-purple-600/20",
  doctor: "bg-sky-50 text-sky-700 ring-sky-600/20",
  receptionist: "bg-amber-50 text-amber-700 ring-amber-600/20",
  pathologist: "bg-teal-50 text-teal-700 ring-teal-600/20",
  pharmacist: "bg-lime-50 text-lime-700 ring-lime-600/20",
  staff: "bg-slate-100 text-slate-700 ring-slate-500/20",
  teacher: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  student: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  officer: "bg-orange-50 text-orange-700 ring-orange-600/20",
  patient: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};
