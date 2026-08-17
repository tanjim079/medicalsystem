import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import { Users, Clock, CreditCard, AlertTriangle, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReceptionistDashboard() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Receptionist Dashboard</h1>
          <p className="text-gray-600">Overview of today's clinic activities</p>
        </div>
        <div className="flex gap-3">
          <Link to="/receptionist/patients" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Manage Patients
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">


        <Card className="flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Waiting Patients</p>
            <p className="text-2xl font-bold text-gray-800">8</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Collection</p>
            <p className="text-2xl font-bold text-gray-800">৳ 12,450</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-800">৳ 3,200</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Medicines</p>
            <p className="text-2xl font-bold text-gray-800">5 Items</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Tests Booked</p>
            <p className="text-2xl font-bold text-gray-800">18</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Quick Actions / Recent Activity */}
        <Card>
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-gray-800">Patient Registration</p>
                <p className="text-gray-500">New student (ID: 2204112) registered</p>
              </div>
              <span className="text-gray-400">10 mins ago</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-gray-800">Payment Received</p>
                <p className="text-gray-500">৳ 450 collected for Blood Test</p>
              </div>
              <span className="text-gray-400">25 mins ago</span>
            </div>

          </div>
        </Card>


    </div>
    </MainLayout>
  );
}
