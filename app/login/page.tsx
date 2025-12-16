'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ADMIN_CREDENTIALS, createId } from "@/src/lib/auth";
import { storage } from "@/src/lib/storage";
import type { StoredAdmin, StoredUser } from "@/src/types/auth";

type CredentialPayload = StoredUser | StoredAdmin;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const doNextAuthSignIn = async (userPayload: CredentialPayload) => {
    await signIn("credentials", {
      redirect: false,
      payload: JSON.stringify(userPayload),
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    // Admin login
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminData = {
        id: "admin-" + createId(),
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: "admin",
      };

      storage.setAuth({ user: null, admin: adminData });
      await doNextAuthSignIn(adminData);
      router.push("/admin");
      return;
    }

    // User login
    const users = storage.getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setMsg("Invalid email or password.");
      return;
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "user",
      isImpersonated: false,
    };

    storage.setAuth({ user: userData, admin: null });
    await doNextAuthSignIn(userData);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6">

        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Login to your account
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:border-black focus:ring-2 focus:ring-black/10 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                         focus:border-black focus:ring-2 focus:ring-black/10 transition"
              required
            />
          </div>

          {msg && (
            <p className="text-sm text-red-600">{msg}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-2.5 text-white font-medium
                       hover:bg-gray-800 active:scale-[0.98] transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => router.push("/signup")}
          className="mt-4 text-sm text-gray-600 hover:text-black hover:underline transition"
        >
          New user? Create account
        </button>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700 mb-1">
            Admin Credentials
          </p>
          <p>admin@admin.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
