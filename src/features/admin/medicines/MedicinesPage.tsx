import AddMedicineForm from "./AddMedicineForm";
import MedicineList from "./MedicineList";

export default function MedicinesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Medicine Management
      </h1>

      <AddMedicineForm />
      <MedicineList />
    </>
  );
}