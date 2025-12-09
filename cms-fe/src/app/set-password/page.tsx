"use client";

import { useState } from "react";

export default function SetPasswordPage() {
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSet(e: any) {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage("✅ " + data.message);
        setNew("");
        setConfirm("");
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
        onSubmit={handleSet}
        className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Set Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Set a new password for your account (no old password required)
        </p>

        {message && (
          <p className="text-center text-blue-600 bg-blue-100 p-2 rounded">
            {message}
          </p>
        )}

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

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="border p-2 w-full rounded text-gray-800 pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showConfirmPassword ? "👁️" : "🫣"}
          </button>
        </div>

        <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
          Set Password
        </button>
      </form>
    </div>
  );
}
