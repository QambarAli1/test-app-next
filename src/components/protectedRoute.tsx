import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "../lib/storage";

type ProtectedRouteProps = {
  children: ReactNode;
  require?: "any" | "admin";
};

export default function ProtectedRoute({ children, require = "any" }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const auth = storage.getAuth();

    const isLoggedIn = !!(auth.user || auth.admin);
    const isAdmin = !!auth.admin;

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (require === "admin" && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [router, require]);

  return children;
}
