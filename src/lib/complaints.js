import { supabase } from "./supabase";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

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
    date: formatDate(row.created_at),
    createdAt: row.created_at,
    duplicateOf: row.duplicate_of ? "RAI-" + (1000 + row.duplicate_of) : null,
    duplicateRowId: row.duplicate_of ?? null,
    duplicateScore: row.duplicate_score ?? null,
  };
}

const LIST_COLUMNS =
  "id, title, location, category, priority, priority_reason, department, status, created_at, duplicate_of, duplicate_score";

// organizationId: whose complaints. userId (optional): only that person's.
export async function getComplaints(organizationId, userId = null) {
  if (!organizationId) return [];

  let query = supabase
    .from("complaints")
    .select(LIST_COLUMNS)
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

export async function getComplaintById(rowId, organizationId) {
  if (!organizationId) return null;

  const { data, error } = await supabase
    .from("complaints")
    .select(LIST_COLUMNS + ", description, subcategory, summary")
    .eq("id", rowId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error || !data) return null;

  let duplicateTitle = null;
  if (data.duplicate_of) {
    const { data: dup } = await supabase
      .from("complaints")
      .select("title")
      .eq("id", data.duplicate_of)
      .eq("organization_id", organizationId)
      .maybeSingle();
    duplicateTitle = dup?.title ?? null;
  }

  return {
    ...toComplaint(data),
    description: data.description,
    subcategory: data.subcategory || "",
    summary: data.summary || "",
    duplicateTitle,
  };
}