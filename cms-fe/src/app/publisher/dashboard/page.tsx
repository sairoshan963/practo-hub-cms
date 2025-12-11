"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PublisherDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "Publisher";
    const role = localStorage.getItem("role") || "PUBLISHER";
    setUserName(name);
    setUserRole(role.replace(/_/g, " "));
  }, []);

  return (
    <ProtectedRoute allowedRole="PUBLISHER">
      <div className="p-8 bg-white min-h-screen">
        <div className="text-3xl font-bold text-gray-800">
          Welcome, {userName} - {userRole}
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => router.push("/profile")}
            className="text-white bg-blue-600 px-4 py-2 rounded inline-block"
          >
            Profile
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
