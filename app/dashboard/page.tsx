'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { storage } from "@/src/lib/storage";
import ProtectedRoute from "@/src/components/protectedRoute";
import type { AuthState } from "@/src/types/auth";

export default function Dashboard() {
    const router = useRouter();
    const [auth] = useState<AuthState>(() => storage.getAuth());

    const logout = async () => {
        const current = storage.getAuth();

        // Impersonation logout → return to admin
        if (current?.admin && current?.user?.isImpersonated) {
            storage.setAuth({ user: null, admin: current.admin });
            router.push("/admin");
            return;
        }

        // Normal logout
        storage.clearAuth();
        await signOut({ redirect: false });
        router.push("/login");
    };

    const userEmail = auth?.user?.email;

    return (
        <ProtectedRoute require="any">
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-gray-100 p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            User Dashboard
                        </h2>
                        <button
                            onClick={logout}
                            className="rounded-xl border border-gray-300 px-4 py-1.5 text-sm
                                       hover:bg-gray-100 transition"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Impersonation Banner */}
                    {auth?.user?.isImpersonated && auth?.admin && (
                        <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                            <b>Impersonation Mode:</b>{" "}
                            Admin ({auth.admin.email}) is viewing as{" "}
                            <b>{auth.user.email}</b>
                        </div>
                    )}

                    {/* User Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="text-xs text-gray-500 mb-1">Name</p>
                            <p className="font-medium text-gray-900">
                                {auth?.user?.name}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="text-xs text-gray-500 mb-1">Email</p>
                            <p className="font-medium text-gray-900">
                                {auth?.user?.email}
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="text-xs text-gray-500 mb-1">Role</p>
                            <p className="font-medium capitalize text-gray-900">
                                {auth?.user?.role}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    {userEmail && (
                        <button
                            onClick={() => router.push("/user-details")}
                            className="mt-6 w-full rounded-xl bg-black py-2.5 text-white font-medium
                                       hover:bg-gray-800 active:scale-[0.98] transition"
                        >
                            Open My Details
                        </button>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
