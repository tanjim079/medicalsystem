import { useState } from "react";
import MedicineList from "./MedicineList";
import AddMedicineForm from "./AddMedicineForm";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";

export default function MedicinesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Medicine Management</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Medicine
        </Button>
      </div>

      <MedicineList />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <AddMedicineForm onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}