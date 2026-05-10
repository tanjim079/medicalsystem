export interface User {
  id: string;
  name: string;
  role: "doctor" | "student" | "teacher" | "officer" | "admin" | "receptionist";
}

export const users: User[] = [
  { id: "DOC001", name: "Dr. Ahmed", role: "doctor" },
  { id: "DOC002", name: "Dr. Rafid", role: "doctor" },
  { id: "2204001", name: "Fatin", role: "student" },
  { id: "2204002", name: "Tanjim", role: "student" },
  { id: "TCH001", name: "Mr. Karim", role: "teacher" },
  { id: "OFF001", name: "Officer Ali", role: "officer" },
  { id: "ADMIN001", name: "Admin", role: "admin" },
  { id: "REC001", name: "Receptionist", role: "receptionist" }
];