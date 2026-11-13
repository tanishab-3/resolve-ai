"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" className="login-link logout-button" onClick={logout}>
      Log out
    </button>
  );
}