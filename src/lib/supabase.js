import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. Never import this file from a "use client" page.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);