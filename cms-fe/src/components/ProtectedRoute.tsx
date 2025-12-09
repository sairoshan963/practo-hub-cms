"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!token || !role) {
      router.push("/login");
      return;
    }

    // If name is missing, clear storage and force re-login
    if (!name) {
      localStorage.clear();
      router.push("/login");
      return;
    }

    if (role.toLowerCase() !== allowedRole.toLowerCase()) {
      router.push("/login");
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}
