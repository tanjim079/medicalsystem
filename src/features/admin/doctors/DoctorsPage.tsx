import DoctorList from "./DoctorList";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
        <Link to="/admin/users">
          <Button className="flex items-center gap-2">
            <Users size={18} /> Manage Doctors in Users
          </Button>
        </Link>
      </div>

      <DoctorList />
    </div>
  );
}