'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/src/lib/storage";
import { createId } from "@/src/lib/auth";

export default function Signup() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
        dob: "",
    });
    const [msg, setMsg] = useState("");

    const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        const users = storage.getUsers();
        const exists = users.some(
            (u) => u.email.toLowerCase() === form.email.toLowerCase()
        );

        if (exists) {
            setMsg("Email already exists.");
            return;
        }

        const newUser = {
            id: createId(),
            role: "user",
            ...form,
        };

        console.log("newUser ", newUser);

        storage.setUsers([...users, newUser]);
        setMsg("Signup successful! Redirecting...");
        setTimeout(() => router.push("/login"), 600);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
                
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Create account
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Sign up to get started
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    {[
                        { key: "name" as const, label: "Name", type: "text" },
                        { key: "email" as const, label: "Email", type: "email" },
                        { key: "password" as const, label: "Password", type: "password" },
                        { key: "phone" as const, label: "Phone", type: "text" },
                        { key: "gender" as const, label: "Gender", type: "text" },
                        { key: "dob" as const, label: "Date of Birth", type: "date" },
                    ].map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                            </label>
                            <input
                                type={type}
                                value={form[key]}
                                onChange={onChange(key)}
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
                                           focus:border-black focus:ring-2 focus:ring-black/10
                                           transition"
                                required
                            />
                        </div>
                    ))}

                    {msg && (
                        <p className={`text-sm ${msg.includes("exists") ? "text-red-600" : "text-green-600"}`}>
                            {msg}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-black py-2.5 text-white font-medium
                                   hover:bg-gray-800 active:scale-[0.98] transition"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-sm text-gray-600 hover:text-black hover:underline transition"
                    >
                        Already have an account? Login
                    </button>
                </div>
            </div>
        </div>
    );
}
