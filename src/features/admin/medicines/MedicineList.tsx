import { useMedicineStore } from "../../../store/useMedicineStore";
import { useEffect, useState } from "react";
import { Search, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MedicineList() {
  const { medicines, fetchMedicines, updateStock } = useMedicineStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-semibold text-lg text-gray-800">Inventory Directory</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>
      
      {medicines.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No medicines found in the inventory.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-3 font-medium rounded-tl-lg">Medicine Name</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-center">Current Stock</th>
                <th className="p-3 font-medium text-right rounded-tr-lg w-32">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-800">{m.name}</td>
                  <td className="p-3">
                    {m.stock < 10 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        <AlertCircle size={14} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        <CheckCircle2 size={14} /> In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-semibold ${m.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                      {m.stock}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      value={m.stock}
                      onChange={(e) => updateStock(m.id, Number(e.target.value))}
                      className="border border-gray-300 rounded-lg w-20 px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                      min="0"
                    />
                  </td>
                </tr>
              ))}
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500 text-sm">
                    No matching medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}