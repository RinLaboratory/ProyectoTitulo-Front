"use client";

import { useRouter } from "next/navigation";
import logout from "./actions";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const success = await logout();
      if (success) {
        router.push("/login");
      }
    };

    void handleLogout();
  }, [router]);
}
