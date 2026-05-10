import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AddMedicineForm() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");

  const handleAdd = () => {
    console.log("Add medicine:", name, stock);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 space-y-3">
      <Input
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Stock Quantity"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <Button onClick={handleAdd}>
        Add Medicine
      </Button>
    </div>
  );
}