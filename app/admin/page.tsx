'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import ProtectedRoute from "@/src/components/protectedRoute";
import { storage } from "@/src/lib/storage";
import type { AuthState, StoredUser } from "@/src/types/auth";

type User = StoredUser;

export default function Admin() {
  const router = useRouter();
  const [users] = useState<User[]>(() => storage.getUsers());
  const [auth] = useState<AuthState>(() => storage.getAuth());

  const impersonate = async (u: User) => {
    const current = storage.getAuth();
    if (!current?.admin) return;

    const impersonatedUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: "user",
      isImpersonated: true,
    };

    const nextAuthState = {
      user: impersonatedUser,
      admin: current.admin,
    };

    storage.setAuth(nextAuthState);

    // Sync with NextAuth
    await signIn("credentials", {
      redirect: false,
      payload: JSON.stringify({
        id: current.admin.id,
        email: current.admin.email,
        role: "admin",
        name: current.admin.name,
        impersonating: u.email,
      }),
    });

    router.push("/dashboard");
    window.open("/user-details", "_blank");
  };

  const logout = async () => {
    storage.clearAuth();
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <ProtectedRoute require="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl border border-gray-100 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Admin Panel
            </h2>
            <button
              onClick={logout}
              className="rounded-xl border border-gray-300 px-4 py-1.5 text-sm
                         hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>

          {/* Admin Info */}
          <p className="text-sm text-gray-600 mb-4">
            <b>Admin:</b> {auth?.admin?.email}
          </p>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-4 py-3 text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => impersonate(u)}
                          className="rounded-lg bg-black px-4 py-1.5 text-white
                                     hover:bg-gray-800 active:scale-[0.97] transition"
                        >
                          Impersonate Login
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No users found. Create users from{" "}
                      <span className="font-medium">/signup</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
