import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import { users } from "../../data/users";
import { medicines as initialMedicines } from "../../data/medicines";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines);

  // Filter doctors only
  const doctors = users.filter((u) => u.role === "doctor");

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateStock = (id: string, value: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, stock: value } : m
      )
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h1>

      {/* 🔷 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Total Doctors</p>
          <p className="text-xl font-bold">{doctors.length}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Total Medicines</p>
          <p className="text-xl font-bold">{medicines.length}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="text-xl font-bold text-red-500">
            {medicines.filter((m) => m.stock < 5).length}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* 👨‍⚕️ Doctor Management */}
        <Card>
          <h2 className="font-semibold mb-3">
            Doctor Management
          </h2>

          <Input
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.id}</p>
                </div>

                <Button
                  onClick={() => alert("Remove doctor (future)")}
                  className="bg-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* 💊 Medicine Management */}
        <Card>
          <h2 className="font-semibold mb-3">
            Medicine Management
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {medicines.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p
                    className={`text-xs ${
                      m.stock < 5 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    Stock: {m.stock}
                  </p>
                </div>

                <input
                  type="number"
                  value={m.stock}
                  onChange={(e) =>
                    updateStock(m.id, Number(e.target.value))
                  }
                  className="w-20 border rounded px-2 py-1"
                  aria-label={'Stock for ${m.name}'}
                />
              </div>
            ))}
          </div>
        </Card>

      </div>
    </>
  );
}