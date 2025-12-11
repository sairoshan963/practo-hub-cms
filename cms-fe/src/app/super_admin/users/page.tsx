"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  specialty?: string;
  city?: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    if (data.success) {
      setUsers(data.users);
    }
    setLoading(false);
  }

  async function updateStatus(userId: string, newStatus: string) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId, newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    }
  }

  async function updateRole(userId: string, newRole: string) {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users/update-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId, newRole }),
    });
    const data = await res.json();
    if (data.success) {
      fetchUsers();
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;

    const query = debouncedSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().replace(/_/g, " ").includes(query)
    );
  }, [users, debouncedSearch]);

  return (
    <ProtectedRoute allowedRole="SUPER_ADMIN">
      <div className="p-8 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <button
            onClick={() => router.push("/super_admin/dashboard")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {debouncedSearch && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredUsers.length} user(s) matching "{debouncedSearch}"
            </p>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Specialty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 text-gray-800">{user.email}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {user.role.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{user.specialty || "-"}</td>
                    <td className="px-6 py-4 text-gray-800">{user.city || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : user.status === "SUSPENDED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select
                          value={user.status}
                          onChange={(e) => updateStatus(user.id, e.target.value)}
                          className="border px-2 py-1 rounded text-xs text-gray-800"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="border px-2 py-1 rounded text-xs text-gray-800"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
