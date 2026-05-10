import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Search, Plus, Edit2, Eye } from "lucide-react";
import { mockPatients } from "../../data/mockPatients";

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState(mockPatients);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setPatients(mockPatients);
      return;
    }

    const filtered = mockPatients.filter(
      p => p.name.toLowerCase().includes(term) || 
           p.universityId.toLowerCase().includes(term) ||
           p.guardianPhone.includes(term) ||
           p.phone.includes(term)
    );
    setPatients(filtered);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-gray-600">Register and manage patient records</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Register New Patient
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Name, ID, or Phone..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline">Filter Options</Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Patient ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Age/Gender</th>
                <th className="p-4 font-semibold">Blood Group</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 text-blue-600 font-medium">{p.universityId}</td>
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.age} / M</td>
                    <td className="p-4">
                      <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>{p.phone} (Self)</div>
                      <div className="text-xs text-gray-400">{p.guardianPhone} (Guardian)</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="View Profile">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-orange-600 transition-colors" title="Edit Patient">
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
