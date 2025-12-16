'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/src/lib/storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = storage.getAuth();
    if (auth?.admin) router.replace("/admin");
    else if (auth?.user) router.replace("/dashboard");
    else router.replace("/login");
  }, [router]);

  return null;
}
