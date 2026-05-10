export interface Patient {
  id: string;
  universityId: string;
  name: string;
  phone: string;
  age: number;
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    universityId: "2204002",
    name: "Tanjim",
    phone: "01783854832",
    age: 23,
    bloodGroup: "O+",
    guardianName: "MD. SALAH UDDIN",
    guardianPhone: "01716390038",
  },
  {
    id: "2",
    universityId: "2204001",
    name: "Fatin",
    phone: "01770917975",
    age: 23,
    bloodGroup: "A+",
    guardianName: "FAHIMA KHANAM",
    guardianPhone: "01715772645",
  },
];