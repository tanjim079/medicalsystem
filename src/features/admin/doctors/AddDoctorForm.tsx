import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AddDoctorForm() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleAdd = () => {
    console.log("Add doctor:", name, id);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4 space-y-3">
      <Input
        placeholder="Doctor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Doctor ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <Button onClick={handleAdd}>
        Add Doctor
      </Button>
    </div>
  );
}