import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { users } from "../data/users";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [role, setRole] = useState<
    "doctor" | "student" | "teacher" | "officer" | "admin" | "receptionist"
  >("doctor");

  const [id, setId] = useState("");

  const handleLogin = () => {
    if (!id.trim()) {
      alert("Enter your ID");
      return;
    }

    const user = users.find(
      (u) =>
        u.id.toLowerCase() === id.toLowerCase() &&
        u.role === role
    );

    if (!user) {
      alert("Invalid ID or role");
      return;
    }

    setUser(user);

    if (user.role === "doctor") {
      navigate("/doctor", { replace: true });
    } else if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "student") {
      navigate("/student", { replace: true });
    } else if (user.role === "receptionist") {
      navigate("/receptionist", { replace: true });
    } else {
      alert(`${user.role} dashboard not implemented yet`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* 🔷 LEFT SIDE - Medical Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Medical Services
          </h1>

          <p className="text-gray-600 leading-relaxed">
            On-campus medical center provides primary and basic healthcare
            facilities to students free of charge. For complicated cases,
            patients are referred to specialist consultants.
          </p>

          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <span className="font-semibold">Service Time:</span><br />
              Sat–Thu: 07:30AM – 10:00PM <br />
              Lunch: 1:30PM – 3:00PM <br />
              <span className="font-semibold">Friday: Off Day</span>
            </p>

            <p>
              <span className="font-semibold">Ambulance:</span> 24 hours (Every day)
            </p>

            <p>
              <span className="font-semibold">Note:</span> Contact doctors for ambulance service.
            </p>
          </div>
        </div>
        
        {/* 🔶 RIGHT SIDE - Login */}
        <div className="flex justify-center">
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-center">
              RUET Medical Login
            </h2>

            <div className="space-y-4 w-72">

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm mb-1">
                  Select Role
                </label>
                <select
                  id="role"
                  className="w-full border rounded-lg px-3 py-2"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as typeof role)
                  }
                >
                  <option value="doctor">Doctor</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>

              {/* ID */}
              <div>
                <label htmlFor="userId" className="block text-sm mb-1">
                  University ID
                </label>
                <Input
                  id="userId"
                  placeholder="Enter ID"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <p className="text-xs text-gray-500">
                Demo IDs: DOC001, RUET001, TCH001, OFF001, ADMIN001, REC001
              </p>

              <Button onClick={handleLogin}>
                Login
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}