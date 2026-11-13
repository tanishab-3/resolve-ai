import { redirect } from "next/navigation";
import { createAuthClient } from "./server";
import { supabase as admin } from "../supabase";

// Returns the logged-in user with their role and organisation, or null
export async function getCurrentUser() {
  const auth = await createAuthClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: profile.full_name,
    role: profile.role,
    organizationId: profile.organization_id,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireStaff() {
  const user = await requireUser();
  if (user.role !== "admin" && user.role !== "officer") redirect("/dashboard");
  return user;
}