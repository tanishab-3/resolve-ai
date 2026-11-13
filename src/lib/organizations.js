import { supabase } from "./supabase";

const COLUMNS = "id, name, slug, type, categories, departments";

export async function getOrganizations() {
  const { data, error } = await supabase
    .from("organizations")
    .select(COLUMNS)
    .order("id", { ascending: true });

  if (error) {
    console.error("Organizations error:", error.message);
    return [];
  }
  return data;
}

export function pickOrganization(orgs, slug) {
  return orgs.find((o) => o.slug === slug) || orgs[0] || null;
}

export async function getOrganizationById(id) {
  const { data, error } = await supabase
    .from("organizations")
    .select(COLUMNS)
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}