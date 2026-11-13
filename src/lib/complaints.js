import { supabase } from "./supabase";

function toComplaint(row) {
  return {
    id: "RAI-" + (1000 + row.id),
    rowId: row.id,
    title: row.title,
    location: row.location,
    category: row.category || "Uncategorised",
    priority: row.priority || "Medium",
    priorityReason: row.priority_reason || "",
    department: row.department || "Unassigned",
    status: row.status,
    date: new Date(row.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    duplicateOf: row.duplicate_of ? "RAI-" + (1000 + row.duplicate_of) : null,
    duplicateScore: row.duplicate_score ?? null,
  };
}

// organizationId: whose complaints. userId (optional): only that person's.
export async function getComplaints(organizationId, userId = null) {
      if (!organizationId) return [];
  let query = supabase
    .from("complaints")
    .select(
      "id, title, location, category, priority, priority_reason, department, status, created_at, duplicate_of, duplicate_score"
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }
  return data.map(toComplaint);
}