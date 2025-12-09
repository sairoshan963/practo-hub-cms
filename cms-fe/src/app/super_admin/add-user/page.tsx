"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddUserPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AGENCY_POC");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const roles = [
    "SUPER_ADMIN",
    "AGENCY_POC",
    "MEDICAL_REVIEWER",
    "BRAND_REVIEWER",
    "DOCTOR_REVIEWER",
    "DOCTOR_CREATOR",
    "APPROVER",
    "PUBLISHER",
  ];

  async function createUser(e: any) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ firstName, lastName, email, password, role, specialty, city }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("User created successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRole("AGENCY_POC");
      setSpecialty("");
      setCity("");
    } else {
      setMessage(data.message || "Error creating user");
    }
  }

  return (
    <ProtectedRoute allowedRole="SUPER_ADMIN">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={createUser}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Add New User
          </h2>

          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            type="password"
            placeholder="Temporary Password"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <select
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          {role === "DOCTOR_CREATOR" && (
            <>
              <input
                type="text"
                placeholder="Specialty (Required for Doctor Creator)"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                autoComplete="off"
                required
              />

              <input
                type="text"
                placeholder="City (Required for Doctor Creator)"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="off"
                required
              />
            </>
          )}

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          <button
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition font-medium"
            type="submit"
          >
            Create User
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
