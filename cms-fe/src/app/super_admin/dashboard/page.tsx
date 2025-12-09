"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "Super Admin";
    const role = localStorage.getItem("role") || "SUPER_ADMIN";
    setUserName(name);
    setUserRole(role.replace(/_/g, " "));
  }, []);

  return (
    <ProtectedRoute allowedRole="SUPER_ADMIN">
      <div className="p-8 bg-white min-h-screen">
        <div className="text-3xl font-bold text-gray-800">
          Welcome, {userName} - {userRole} 🎉
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => router.push("/super_admin/add-user")}
            className="text-white bg-green-600 px-4 py-2 rounded inline-block"
          >
            ➕ Add New User
          </button>
          <button
            onClick={() => router.push("/super_admin/users")}
            className="text-white bg-purple-600 px-4 py-2 rounded inline-block"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => router.push("/set-password")}
            className="text-white bg-blue-600 px-4 py-2 rounded inline-block"
          >
            🔑 Set Password
          </button>
          <button
            onClick={() => router.push("/change-password")}
            className="text-white bg-indigo-600 px-4 py-2 rounded inline-block"
          >
            🔐 Change Password
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
