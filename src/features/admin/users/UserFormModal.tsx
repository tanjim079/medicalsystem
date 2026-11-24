import { useState, type FormEvent } from "react";
import { Globe } from "lucide-react";
import { Modal, Btn, Field, TextInput, SelectInput } from "../components/ui";
import { useUserStore, accountTypeOf, type AccountType, type UserProfile, type UserPayload } from "../../../store/useUserStore";
import { toast } from "../lib/useToastStore";
import { errorMessage } from "../lib/adminApi";
import { ROLE_LABELS } from "../lib/format";

import { ROLE_OPTIONS, PATIENT_TYPES } from "../lib/roles";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type PatientForm = NonNullable<UserPayload["patientData"]>;
const emptyPatient: Required<PatientForm> = {
  universityId: "", phone: "", bloodGroup: "", guardianName: "", guardianPhone: "", department: "", age: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  defaultRole?: AccountType;
  lockRole?: boolean;
}

// Mounted fresh each time the modal opens, so form state initialises from props without effects.
export default function UserFormModal(props: Props) {
  if (!props.open) return null;
  return <UserForm key={props.user?.id || "new"} {...props} />;
}

function UserForm({ open, onClose, user, defaultRole = "student", lockRole }: Props) {
  const { addUser, updateUser } = useUserStore();
  const p0 = user?.patients || {};
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountType>(user ? accountTypeOf(user) : defaultRole);
  const [patient, setPatient] = useState<Required<PatientForm>>(user ? {
    universityId: p0.roll_number || "",
    phone: p0.phone || "",
    bloodGroup: p0.blood_group || "",
    guardianName: p0.guardian_name || "",
    guardianPhone: p0.guardian_phone || "",
    department: p0.department || "",
    age: p0.age != null ? String(p0.age) : "",
  } : emptyPatient);
  const [publish, setPublish] = useState(true);
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const isPatient = PATIENT_TYPES.includes(role);
  // New doctor accounts are listed on the public Doctors page by default.
  const showDirectory = !user && role === "doctor";

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter the full name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email address";
    if (!user && password.length < 8) e.password = "Password must be at least 8 characters";
    if (user && password && password.length < 8) e.password = "Password must be at least 8 characters";
    if (isPatient && patient.age && (!/^\d+$/.test(patient.age) || +patient.age > 120)) e.age = "Enter a valid age";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload: UserPayload = {
      name: name.trim(),
      email: email.trim(),
      role,
      ...(password ? { password } : {}),
      ...(isPatient ? { patientData: patient } : {}),
      ...(showDirectory ? { directoryListing: { publish, designation: designation.trim(), contact: contact.trim() } } : {}),
    };
    try {
      if (user) {
        await updateUser(user.id, payload);
        toast.success(`${payload.name} updated`);
      } else {
        const created = await addUser(payload);
        if (created.warning) toast.info(created.warning);
        else if (created.directoryEntry) toast.success(`${payload.name} created and listed on the public Doctors page`);
        else toast.success(`${payload.name} created as ${ROLE_LABELS[role]}`);
      }
      onClose();
    } catch (err) {
      toast.error(errorMessage(err, "Could not save user"));
    } finally {
      setSaving(false);
    }
  };

  const setP = (k: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setPatient((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={user ? "Edit user" : lockRole ? `Add ${ROLE_LABELS[defaultRole].toLowerCase()}` : "Create user account"}
      description={user ? user.email : "The account can sign in immediately with the password you set."}
      footer={
        <>
          <Btn variant="secondary" type="button" onClick={onClose} disabled={saving}>Cancel</Btn>
          <Btn type="submit" form="user-form" loading={saving}>{user ? "Save changes" : "Create account"}</Btn>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name} className="sm:col-span-2">
            {(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Farhana Rahman" autoFocus />}
          </Field>
          <Field label="Email" required error={errors.email}>
            {(id) => <TextInput id={id} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@ruet.ac.bd" />}
          </Field>
          <Field label="Role" required>
            {(id) => (
              <SelectInput id={id} value={role} onChange={(e) => setRole(e.target.value as AccountType)} disabled={lockRole}>
                {["Patients", "Medical staff", "Operations"].map((g) => (
                  <optgroup key={g} label={g}>
                    {ROLE_OPTIONS.filter((o) => o.group === g).map((o) => (
                      <option key={o.value} value={o.value}>{ROLE_LABELS[o.value]}</option>
                    ))}
                  </optgroup>
                ))}
              </SelectInput>
            )}
          </Field>
          <Field
            label={user ? "New password" : "Password"}
            required={!user}
            error={errors.password}
            hint={user ? "Leave blank to keep the current password." : "At least 8 characters."}
            className="sm:col-span-2"
          >
            {(id) => <TextInput id={id} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
          </Field>
        </div>

        {showDirectory && (
          <div className="border-t border-slate-100 pt-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <Globe size={14} className="text-slate-400" /> List on the public website
                </span>
                <span className="block text-xs text-slate-500">
                  Adds this doctor to the Doctors page and the public directory. You can edit or remove the listing later.
                </span>
              </span>
            </label>
            {publish && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Designation" hint="Defaults to Medical Officer">
                  {(id) => <TextInput id={id} value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Medical Officer" />}
                </Field>
                <Field label="Public phone">
                  {(id) => <TextInput id={id} type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="01XXXXXXXXX" />}
                </Field>
              </div>
            )}
          </div>
        )}

        {isPatient && (
          <div>
            <div className="mb-3 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-900">Patient record</h3>
              <p className="text-xs text-slate-500">Used by doctors, the laboratory and billing to identify this patient.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label={role === "student" ? "Roll number" : "Employee ID"}>
                {(id) => <TextInput id={id} value={patient.universityId} onChange={setP("universityId")} placeholder={role === "student" ? "2204001" : "EMP-101"} />}
              </Field>
              <Field label="Department">
                {(id) => <TextInput id={id} value={patient.department} onChange={setP("department")} placeholder="CSE" />}
              </Field>
              <Field label="Phone">
                {(id) => <TextInput id={id} type="tel" value={patient.phone} onChange={setP("phone")} placeholder="01XXXXXXXXX" />}
              </Field>
              <Field label="Age" error={errors.age}>
                {(id) => <TextInput id={id} inputMode="numeric" value={patient.age} onChange={setP("age")} />}
              </Field>
              <Field label="Blood group">
                {(id) => (
                  <SelectInput id={id} value={patient.bloodGroup} onChange={setP("bloodGroup")}>
                    <option value="">Not recorded</option>
                    {[...new Set([...BLOOD_GROUPS, ...(patient.bloodGroup ? [patient.bloodGroup] : [])])].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </SelectInput>
                )}
              </Field>
              <div className="hidden sm:block" />
              <Field label="Guardian name">
                {(id) => <TextInput id={id} value={patient.guardianName} onChange={setP("guardianName")} />}
              </Field>
              <Field label="Guardian phone">
                {(id) => <TextInput id={id} type="tel" value={patient.guardianPhone} onChange={setP("guardianPhone")} />}
              </Field>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
