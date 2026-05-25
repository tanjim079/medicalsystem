export interface MedicalTest {
  id: string;
  name: string;
  category: "Pathology" | "ECG" | "Ultrasonography";
  studentPrice: number;
  employeePrice: number;
}

export const medicalTests: MedicalTest[] = [
  // Pathology (from image 1, SL 1-22)
  { id: "T-001", name: "Blood for HB%", category: "Pathology", studentPrice: 15.00, employeePrice: 30.00 },
  { id: "T-002", name: "Blood for TC", category: "Pathology", studentPrice: 15.00, employeePrice: 30.00 },
  { id: "T-003", name: "Blood for DC", category: "Pathology", studentPrice: 15.00, employeePrice: 30.00 },
  { id: "T-004", name: "Blood for ESR", category: "Pathology", studentPrice: 25.00, employeePrice: 50.00 },
  { id: "T-005", name: "CBC", category: "Pathology", studentPrice: 50.00, employeePrice: 100.00 },
  { id: "T-006", name: "HbA1C", category: "Pathology", studentPrice: 100.00, employeePrice: 250.00 },
  { id: "T-007", name: "Fasting Blood Sugar (FBS) with CUS", category: "Pathology", studentPrice: 20.00, employeePrice: 40.00 },
  { id: "T-008", name: "Post Parandal Blood Sugar (PPBS) with CUS", category: "Pathology", studentPrice: 20.00, employeePrice: 40.00 },
  { id: "T-009", name: "Random Blood Sugar (RBS) with CUS", category: "Pathology", studentPrice: 20.00, employeePrice: 40.00 },
  { id: "T-010", name: "Blood for S. Bilirubin", category: "Pathology", studentPrice: 30.00, employeePrice: 70.00 },
  { id: "T-011", name: "Blood Urea", category: "Pathology", studentPrice: 30.00, employeePrice: 70.00 },
  { id: "T-012", name: "Serum Creatinine", category: "Pathology", studentPrice: 40.00, employeePrice: 80.00 },
  { id: "T-013", name: "Lipid Profile", category: "Pathology", studentPrice: 150.00, employeePrice: 350.00 },
  { id: "T-014", name: "SGPT (ALT)", category: "Pathology", studentPrice: 40.00, employeePrice: 100.00 },
  { id: "T-015", name: "Serum Uric Acid", category: "Pathology", studentPrice: 40.00, employeePrice: 80.00 },
  { id: "T-016", name: "Blood Grouping & Rh Typing", category: "Pathology", studentPrice: 15.00, employeePrice: 80.00 },
  { id: "T-017", name: "Blood for HBs Ag (Confirmatory by ICT)", category: "Pathology", studentPrice: 60.00, employeePrice: 150.00 },
  { id: "T-018", name: "RA Test", category: "Pathology", studentPrice: 50.00, employeePrice: 100.00 },
  { id: "T-019", name: "Widal Test", category: "Pathology", studentPrice: 50.00, employeePrice: 120.00 },
  { id: "T-020", name: "Weil Felix test", category: "Pathology", studentPrice: 50.00, employeePrice: 100.00 },
  { id: "T-021", name: "Urine for R/M/E", category: "Pathology", studentPrice: 25.00, employeePrice: 50.00 },
  { id: "T-022", name: "Stool for R/M/E", category: "Pathology", studentPrice: 20.00, employeePrice: 40.00 },
  // ECG (from image 1, SL 23)
  { id: "T-023", name: "ECG", category: "ECG", studentPrice: 50.00, employeePrice: 100.00 },
  
  // Ultrasonography (from image 2, SL 1-10)
  { id: "U-001", name: "Ultrasound of Whole Abdomen", category: "Ultrasonography", studentPrice: 150.00, employeePrice: 300.00 },
  { id: "U-002", name: "Ultrasound of Lower Abdomen", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-003", name: "Ultrasound of Upper Abdomen", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-004", name: "Ultrasound of Pregnancy Profile", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 300.00 },
  { id: "U-005", name: "Ultrasound of Testes", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-006", name: "Ultrasound of KUB Region", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-007", name: "Ultrasound of Hepato Biliary System", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-008", name: "Ultrasound of Breast", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-009", name: "Ultrasound of Thyroid Gland", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
  { id: "U-010", name: "Ultrasound of Any other Organ", category: "Ultrasonography", studentPrice: 100.00, employeePrice: 200.00 },
];
