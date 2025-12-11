"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("set");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    const name = localStorage.getItem("name") || "";
    let email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";
    
    // Always get email from JWT token since localStorage might not have it
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email || email;
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
    
    setUserName(name);
    setUserEmail(email);
    setUserRole(role.replace(/_/g, " "));
  }, [router]);

  async function handleSetPassword(e: any) {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/auth/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
    
    if (data.success) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleChangePassword(e: any) {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
    
    if (data.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Back
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Name: <span className="font-medium">{userName}</span></p>
            <p className="text-sm text-gray-600">Email: <span className="font-medium">{userEmail}</span></p>
            <p className="text-sm text-gray-600">Role: <span className="font-medium">{userRole}</span></p>
          </div>

          <div className="flex mb-6 border-b">
            <button
              onClick={() => setActiveTab("set")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "set"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Set Password
            </button>
            <button
              onClick={() => setActiveTab("change")}
              className={`flex-1 py-2 px-4 text-sm font-medium ${
                activeTab === "change"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Change Password
            </button>
          </div>

          {activeTab === "set" && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition font-medium"
              >
                Set Password
              </button>
            </form>
          )}

          {activeTab === "change" && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition font-medium"
              >
                Change Password
              </button>
            </form>
          )}

          {message && (
            <p className={`mt-4 text-sm text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
}