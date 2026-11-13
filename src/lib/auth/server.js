import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used on the server to find out who is logged in
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't write cookies. The proxy does it.
          }
        },
      },
    }
  );
}