import { useState, type FormEvent } from "react";
import { ShieldCheck, Clock, Phone, Server } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { PageHeader, Panel, Btn, Field, TextInput } from "../components/ui";
import { apiRequest, errorMessage, API_URL } from "../lib/adminApi";
import { toast } from "../lib/useToastStore";
import { siteSettings } from "../../../config/siteSettings";
import { useAdminStats } from "../lib/useAdminStats";
import { formatDateTime } from "../lib/format";

export default function SettingsPage() {
  const { user, setUser, token, refreshToken } = useAuthStore();
  const stats = useAdminStats((s) => s.stats);
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  if (!user) return null;

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) return toast.error("Name must be at least 2 characters");
    setSavingProfile(true);
    try {
      await apiRequest(`/users/${user.id}`, { method: "PUT", json: { name: n } });
      setUser({ ...user, name: n }, token || "", refreshToken);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setPwError("Password must be at least 8 characters");
    if (pw !== confirm) return setPwError("Passwords do not match");
    setSavingPw(true);
    try {
      await apiRequest(`/users/${user.id}/password`, { method: "PUT", json: { password: pw } });
      setPw(""); setConfirm(""); setPwError("");
      toast.success("Password changed. Use the new password next time you sign in.");
    } catch (err) {
      setPwError(errorMessage(err));
    } finally {
      setSavingPw(false);
    }
  };

  const h = siteSettings.serviceHours;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your administrator account and system information." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Profile" description="How your name appears across the system.">
          <form onSubmit={saveProfile} className="space-y-4">
            <Field label="Full name">{(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
            <Field label="Email" hint="Contact another administrator to change your sign-in email.">
              {(id) => <TextInput id={id} value={user.email || ""} disabled />}
            </Field>
            <div className="flex justify-end">
              <Btn type="submit" loading={savingProfile} disabled={name.trim() === user.name}>Save profile</Btn>
            </div>
          </form>
        </Panel>

        <Panel title="Change password" description="Use at least 8 characters. A passphrase is best.">
          <form onSubmit={savePassword} className="space-y-4">
            <Field label="New password" error={pwError}>
              {(id) => <TextInput id={id} type="password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setPwError(""); }} />}
            </Field>
            <Field label="Confirm new password">
              {(id) => <TextInput id={id} type="password" autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setPwError(""); }} />}
            </Field>
            <div className="flex justify-end">
              <Btn type="submit" loading={savingPw} disabled={!pw}>Update password</Btn>
            </div>
          </form>
        </Panel>

        <Panel title="Service information" description="Shown on the public website. Edit src/config/siteSettings.ts to change.">
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3"><Clock size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">Working hours</dt><dd className="text-slate-900">{h.workingDaysLabel}, {h.time}</dd></div></div>
            <div className="flex gap-3"><Clock size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">{h.lunchBreakLabel}</dt><dd className="text-slate-900">{h.lunchBreakTime} · {h.offDayLabel} {h.offDayStatus.toLowerCase()}</dd></div></div>
            <div className="flex gap-3"><Phone size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">Ambulance</dt><dd className="text-slate-900">{siteSettings.contacts.ambulance.phoneCombined}</dd></div></div>
          </dl>
        </Panel>

        <Panel title="System" description="Connection and security details.">
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3"><Server size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">API endpoint</dt><dd className="break-all font-mono text-xs text-slate-900">{API_URL}</dd></div></div>
            <div className="flex gap-3"><ShieldCheck size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">Access control</dt><dd className="text-slate-900">Admin actions require a live, non-revoked session and are verified server-side against your database role.</dd></div></div>
            {stats && <div className="flex gap-3"><Clock size={16} className="mt-0.5 text-slate-400" /><div><dt className="text-slate-500">Statistics last refreshed</dt><dd className="text-slate-900">{formatDateTime(stats.generatedAt)}</dd></div></div>}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
