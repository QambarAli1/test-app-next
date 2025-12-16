'use client';

import { useMemo, useState } from "react";
import ChangePasswordModal from "@/src/components/chng";
import ProtectedRoute from "@/src/components/protectedRoute";
import { storage } from "@/src/lib/storage";
import type { AuthState, StoredUser } from "@/src/types/auth";

type DbUser = StoredUser;


export default function UserDetails() {
  const [auth] = useState<AuthState>(() => storage.getAuth());
  const [dbUser] = useState<DbUser | null>(() => {
    const current = storage.getAuth();
    const users: DbUser[] = storage.getUsers();
    return users.find((u) => u.email === current?.user?.email) || null;
  });
  const [open, setOpen] = useState<boolean>(false);

  const title = useMemo(() => {
    if (auth?.user?.isImpersonated && auth?.admin) {
      return "User Details (Impersonated)";
    }
    return "User Details";
  }, [auth]);

  return (
    <ProtectedRoute require="any">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-gray-100 p-6">

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h2>

          {/* Impersonation Banner */}
          {auth?.user?.isImpersonated && auth?.admin && (
            <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
              <b>Admin:</b> {auth.admin.email}
              <span className="mx-2">|</span>
              <b>Viewing:</b> {auth.user.email}
            </div>
          )}

          {/* Content */}
          {!dbUser ? (
            <p className="text-gray-600">
              User record not found in LocalStorage.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Name" value={dbUser.name} />
                <Info label="Email" value={dbUser.email} />
                <Info label="Phone" value={dbUser.phone || "—"} />
                <Info label="Gender" value={dbUser.gender || "—"} />
                <Info label="Date of Birth" value={dbUser.dob || "—"} />
              </div>

              <button
                onClick={() => setOpen(true)}
                className="mt-4 w-full rounded-xl bg-black py-2.5 text-white font-medium
                           hover:bg-gray-800 active:scale-[0.98] transition"
              >
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        <ChangePasswordModal
          open={open}
          onClose={() => setOpen(false)}
          userEmail={dbUser?.email ?? ""}
        />
      </div>
    </ProtectedRoute>
  );
}


function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
