import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

interface Medicine {
  name: string;
  dosage: string;
  days: string;
}

export default function PrescriptionPanel() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [form, setForm] = useState<Medicine>({
    name: "",
    dosage: "",
    days: "",
  });

  const addMedicine = () => {
    if (!form.name || !form.dosage || !form.days) return;

    setMedicines((prev) => [...prev, form]);

    setForm({
      name: "",
      dosage: "",
      days: "",
    });
  };

  return (
    <Card>
      <h2 className="font-semibold mb-4">Prescription</h2>

      {/* Form */}
      <div className="space-y-2">
        <Input
          placeholder="Medicine name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          placeholder="Dosage (e.g. 1+1+1)"
          value={form.dosage}
          onChange={(e) =>
            setForm({ ...form, dosage: e.target.value })
          }
        />

        <Input
          placeholder="Days"
          value={form.days}
          onChange={(e) =>
            setForm({ ...form, days: e.target.value })
          }
        />

        <Button onClick={addMedicine}>Add Medicine</Button>
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {medicines.length === 0 ? (
          <p className="text-sm text-gray-500">No medicines added</p>
        ) : (
          medicines.map((m, i) => (
            <div
              key={i}
              className="text-sm border rounded p-2"
            >
              <strong>{m.name}</strong> — {m.dosage} for {m.days} days
            </div>
          ))
        )}
      </div>
    </Card>
  );
}