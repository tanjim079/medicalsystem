import type { AccountType } from "../../../store/useUserStore";

export const ROLE_OPTIONS: { value: AccountType; group: string }[] = [
  { value: "student", group: "Patients" },
  { value: "teacher", group: "Patients" },
  { value: "officer", group: "Patients" },
  { value: "doctor", group: "Medical staff" },
  { value: "pathologist", group: "Medical staff" },
  { value: "pharmacist", group: "Medical staff" },
  { value: "receptionist", group: "Operations" },
  { value: "staff", group: "Operations" },
  { value: "admin", group: "Operations" },
];

export const PATIENT_TYPES: AccountType[] = ["student", "teacher", "officer", "patient"];
