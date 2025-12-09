"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BrandReviewerDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "Brand Reviewer";
    const role = localStorage.getItem("role") || "BRAND_REVIEWER";
    setUserName(name);
    setUserRole(role.replace(/_/g, " "));
  }, []);

  return (
    <ProtectedRoute allowedRole="BRAND_REVIEWER">
      <div className="p-8 bg-white min-h-screen">
        <div className="text-3xl font-bold text-gray-800">
          Welcome, {userName} - {userRole}
        </div>
        <div className="mt-4 space-x-4">
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
