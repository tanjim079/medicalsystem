import { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useBillingStore } from "../../store/useBillingStore";
import { Search, DollarSign, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { useState } from "react";

export default function BillingHistory() {
  const bills = useBillingStore((s) => s.bills);
  const fetchBills = useBillingStore((s) => s.fetchBills);
  const updateBillStatus = useBillingStore((s) => s.updateBillStatus);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Paid" | "Due">("All");

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing History</h1>
          <p className="text-gray-600">Track and manage patient test bills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4 bg-white">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ৳ {bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 bg-white">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Due</p>
            <p className="text-2xl font-bold text-gray-900">
              ৳ {bills.filter(b => b.status === 'Due').reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </Card>
      </div>

      <Card className="bg-white">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search by ID, Name or Invoice..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select 
            className="border-gray-200 rounded-lg text-sm focus:ring-blue-500 w-full sm:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "All" | "Paid" | "Due")}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No bills found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-blue-600">{bill.id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{bill.patientName}</p>
                      <p className="text-xs text-gray-500">{bill.patientId}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={14} className="mr-2" />
                        {new Date(bill.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      ৳ {bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${bill.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {bill.status === 'Paid' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {bill.status === 'Due' && (
                        <button 
                          onClick={() => updateBillStatus(bill.id, 'Paid')}
                          className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-medium hover:bg-green-100 transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}


