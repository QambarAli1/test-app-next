import { useState } from "react";
import { storage } from "../lib/storage";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  userEmail: string;
};

export default function ChangePasswordModal({
  open,
  onClose,
  userEmail,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [msg, setMsg] = useState("");

  if (!open) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const users = storage.getUsers();
    const user = users.find((u) => u.email === userEmail);

    if (!user) {
      setMsg("User not found.");
      return;
    }

    if (user.password !== oldPassword) {
      setMsg("Old password is incorrect.");
      return;
    }

    if (newPassword.length < 4) {
      setMsg("New password must be at least 4 characters.");
      return;
    }

    if (newPassword !== confirmNew) {
      setMsg("New password and confirm password do not match.");
      return;
    }

    const updated = users.map((u) =>
      u.email === userEmail ? { ...u, password: newPassword } : u
    );

    storage.setUsers(updated);

    setMsg("Password updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmNew("");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-lg transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:border-black focus:ring-2 focus:ring-black/10 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:border-black focus:ring-2 focus:ring-black/10 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:border-black focus:ring-2 focus:ring-black/10 transition"
              required
            />
          </div>

          {msg && (
            <p
              className={`text-sm ${msg.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
                }`}
            >
              {msg}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-2.5 text-white font-medium
                       hover:bg-gray-800 active:scale-[0.98] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
