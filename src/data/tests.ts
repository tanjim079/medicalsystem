export interface MedicalTest {
  id: string;
  name: string;
  category: "Blood" | "Urine" | "Imaging" | "General";
  price: number;
}

export const medicalTests: MedicalTest[] = [
  { id: "T-001", name: "Complete Blood Count (CBC)", category: "Blood", price: 400 },
  { id: "T-002", name: "Blood Glucose (Fasting)", category: "Blood", price: 150 },
  { id: "T-003", name: "Lipid Profile", category: "Blood", price: 800 },
  { id: "T-004", name: "Urine Routine Examination", category: "Urine", price: 200 },
  { id: "T-005", name: "Chest X-Ray (PA View)", category: "Imaging", price: 500 },
  { id: "T-006", name: "Ultrasonography (Whole Abdomen)", category: "Imaging", price: 1200 },
  { id: "T-007", name: "ECG", category: "General", price: 300 },
  { id: "T-008", name: "Dengue NS1 Antigen", category: "Blood", price: 600 },
  { id: "T-009", name: "Serum Creatinine", category: "Blood", price: 350 },
  { id: "T-010", name: "Thyroid Profile (T3, T4, TSH)", category: "Blood", price: 1500 },
];
