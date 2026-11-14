import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { deletePolicy } from "@/lib/policies";

export async function DELETE(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (user.role !== "admin" || !user.organizationId) {
      return NextResponse.json({ error: "Only admins can delete policies" }, { status: 403 });
    }

    const { id } = await params;
    const policyId = Number(id);
    if (!Number.isInteger(policyId)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }

    await deletePolicy(user.organizationId, policyId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete policy failed:", error?.message || error);
    return NextResponse.json({ error: "Could not delete the policy" }, { status: 500 });
  }
}