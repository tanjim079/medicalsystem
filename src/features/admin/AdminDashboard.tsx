import Card from "../../components/ui/Card";
import { useUserStore } from "../../store/useUserStore";
import { useMedicineStore } from "../../store/useMedicineStore";
import { useEffect } from "react";
import { Users, UserPlus, Stethoscope, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { users, fetchUsers, getDoctors } = useUserStore();
  const doctors = getDoctors();
  const patients = users.filter(u => u.role === 'patient' || u.role === 'student');

  const { medicines, fetchMedicines } = useMedicineStore();

  useEffect(() => {
    fetchUsers();
    fetchMedicines();
  }, [fetchUsers, fetchMedicines]);

  const lowStockMedicines = medicines.filter((m) => m.stock < 10);

  // Chart Data preparation
  const topMedicines = [...medicines].sort((a, b) => a.stock - b.stock).slice(0, 5).map(m => ({
    name: m.name,
    stock: m.stock
  }));

  const userRolesData = [
    { name: 'Students/Patients', value: patients.length },
    { name: 'Doctors', value: doctors.length },
    { name: 'Staff', value: users.filter(u => !['patient', 'student', 'doctor'].includes(u.role)).length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* 🔷 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5 border-l-4 border-indigo-500">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 border-l-4 border-green-500">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Patients</p>
            <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 border-l-4 border-blue-500">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Doctors</p>
            <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5 border-l-4 border-red-500">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Meds</p>
            <p className="text-2xl font-bold text-gray-800">{lowStockMedicines.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Distribution Chart */}
        <Card className="p-5 h-96 flex flex-col">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">User Distribution</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRolesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRolesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lowest Stock Medicines Chart */}
        <Card className="p-5 h-96 flex flex-col">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">Lowest Stock Medicines</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topMedicines}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="stock" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
}