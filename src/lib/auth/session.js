import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
    .select("full_name, role, organization_id, is_platform_admin")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  let organizationId = profile.organization_id;

  // Only platform admins may act inside another organisation.
  // For everyone else the cookie is ignored.
  if (profile.is_platform_admin) {
    const cookieStore = await cookies();
    const chosen = Number(cookieStore.get("active_org")?.value);

    if (Number.isInteger(chosen)) {
      const { data: org } = await admin
        .from("organizations")
        .select("id")
        .eq("id", chosen)
        .maybeSingle();
      if (org) organizationId = org.id;
    }
  }

  return {
    id: user.id,
    email: user.email,
    fullName: profile.full_name,
    role: profile.role,
    organizationId,
    homeOrganizationId: profile.organization_id,
    isPlatformAdmin: Boolean(profile.is_platform_admin),
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