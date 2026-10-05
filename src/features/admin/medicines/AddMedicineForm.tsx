import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useMedicineStore } from "../../../store/useMedicineStore";

export default function AddMedicineForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const addMedicine = useMedicineStore(s => s.addMedicine);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock) return;
    await addMedicine(name, parseInt(stock) || 0);
    setName("");
    setStock("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-100 pb-3">
        Add New Medicine
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
        <Input
          placeholder="e.g. Paracetamol"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
        <Input
          placeholder="e.g. 100"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          min="0"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Save Medicine
        </Button>
      </div>
    </form>
  );
}