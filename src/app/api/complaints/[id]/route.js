import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrganizationById } from "@/lib/organizations";
import { statusSteps } from "@/app/data";

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (user.role !== "admin" && user.role !== "officer") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const { id } = await params;
    const rowId = Number(id);
    if (!Number.isInteger(rowId)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    // The complaint must belong to the staff member's own organisation
    const { data: complaint } = await supabase
      .from("complaints")
      .select("id, organization_id")
      .eq("id", rowId)
      .single();

    if (!complaint || complaint.organization_id !== user.organizationId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const org = await getOrganizationById(user.organizationId);
    const body = await request.json();
    const updates = {};

    if (body.status !== undefined) {
      if (!statusSteps.includes(body.status)) {
        return NextResponse.json({ error: "Bad status" }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.department !== undefined) {
      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Only admins can reassign departments" },
          { status: 403 }
        );
      }
      if (!org.departments.includes(body.department)) {
        return NextResponse.json({ error: "Bad department" }, { status: 400 });
      }
      updates.department = body.department;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const { error } = await supabase
      .from("complaints")
      .update(updates)
      .eq("id", rowId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update failed:", error?.message || error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}