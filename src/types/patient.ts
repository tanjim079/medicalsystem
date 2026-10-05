export interface Patient {
  id: string;
  universityId: string; // Roll number or Employee ID
  name: string;
  department?: string;
  bloodGroup: string;
  age: string | number;
  phone: string;
  guardianName?: string;
  guardianPhone?: string;
}
