import { Outlet, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import { useAuthStore } from "../store/useAuthStore";

export default function PathologistLayout() {
  const user = useAuthStore((s) => s.user);

  // Protected route logic - if not logged in or not a pathologist, redirect
  if (!user || user.role !== "pathologist") {
    return <Navigate to="/login" replace />;
  }


  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[70vh] print:border-none print:shadow-none print:p-0 print:min-h-0">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}
