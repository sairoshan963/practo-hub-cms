"use client";

import { useState, useEffect } from "react";

export default function ChangePasswordPage() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);
  }, []);

  async function handleChange(e: any) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage("✅ " + data.message);
        setOld("");
        setNew("");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleChange}
        className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Change Password</h1>

        {message && (
          <p className="text-center text-blue-600 bg-blue-100 p-2 rounded">
            {message}
          </p>
        )}

        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            className="border p-2 w-full rounded text-gray-800 pr-10"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showOldPassword ? "👁️" : "🫣"}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className="border p-2 w-full rounded text-gray-800 pr-10"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showNewPassword ? "👁️" : "🫣"}
          </button>
        </div>

        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Update Password
        </button>
      </form>
    </div>
  );
}
