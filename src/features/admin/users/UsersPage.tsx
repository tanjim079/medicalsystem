import { useState, useEffect } from "react";
import { useUserStore, type UserProfile } from "../../../store/useUserStore";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function UsersPage() {
  const { users, fetchUsers, addUser, updateUser, deleteUser, loading } = useUserStore();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 'student',
    patientData: {
      universityId: "",
      phone: "",
      bloodGroup: "",
      guardianName: "",
      guardianPhone: "",
      department: "",
      age: "",
    }
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
      const p = (user as any).patients?.[0] || (user as any).patients || {};
      setFormData({ name: user.name, email: user.email, password: "", role: user.role, patientData: { universityId: p.roll_number || "", phone: p.phone || "", bloodGroup: p.blood_group || "", guardianName: p.guardian_name || "", guardianPhone: p.guardian_phone || "", department: p.department || "", age: p.age || "" } });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: 'student', patientData: { universityId: "", phone: "", bloodGroup: "", guardianName: "", guardianPhone: "", department: "", age: "" } });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await updateUser(editingUser.id, formData as any);
    } else {
      await addUser(formData as any);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} /> Add User
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="officer">Officer</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
            <option value="receptionist">Receptionist</option>
            <option value="pathologist">Pathologist</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-3 font-medium rounded-tl-lg">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-gray-800">{user.name}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 shrink-0">
              <h2 className="text-lg font-bold text-gray-800">{editingUser ? "Edit User" : "Add New User"}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
              <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email / User ID</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingUser && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}
                  </label>
                  <input
                    required={!editingUser}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={editingUser ? "Enter new password if changing..." : "Assign a strong password"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="officer">Officer</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="pathologist">Pathologist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {['student', 'teacher', 'officer', 'patient'].includes(formData.role) && (
                  <>
                    <div className="pt-4 border-t border-gray-100 mt-2">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Patient Details</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University ID (Roll/Emp ID)</label>
                      <input type="text" value={formData.patientData.universityId} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, universityId: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input type="text" value={formData.patientData.department} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, department: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <input type="text" value={formData.patientData.bloodGroup} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, bloodGroup: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" value={formData.patientData.phone} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, phone: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input type="text" value={formData.patientData.age} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, age: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input type="text" value={formData.patientData.guardianName} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, guardianName: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                        <input type="text" value={formData.patientData.guardianPhone} onChange={(e) => setFormData({ ...formData, patientData: { ...formData.patientData, guardianPhone: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">{editingUser ? "Save Changes" : "Create User"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



