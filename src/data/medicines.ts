export interface Medicine {
  id: string;
  name: string;
  stock: number;
}

export const medicines: Medicine[] = [
  { id: "m1", name: "Paracetamol", stock: 50 },
  { id: "m2", name: "Napa", stock: 50 },
  { id: "m3", name: "Azithromycin", stock: 20 },
  { id: "m4", name: "Ibuprofen", stock: 10 },
];