import { createBrowserClient } from "@supabase/ssr";

// Used inside "use client" pages (login, signup, logout)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}