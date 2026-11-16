import { consumeQuota, LIMIT_MESSAGES } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { addPolicy, MAX_POLICY_CHARS } from "@/lib/policies";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (user.role !== "admin" || !user.organizationId) {
      return NextResponse.json({ error: "Only admins can add policies" }, { status: 403 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim().slice(0, 200);
    const text = String(body.text || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Please enter a title" }, { status: 400 });
    }
    if (text.length < 50) {
      return NextResponse.json({ error: "The policy text is too short" }, { status: 400 });
    }
    if (text.length > MAX_POLICY_CHARS) {
      return NextResponse.json(
        { error: `The policy text is too long (maximum ${MAX_POLICY_CHARS} characters)` },
        { status: 400 }
      );
    }
    if (!(await consumeQuota(user.id, "policy"))) {
      return NextResponse.json({ error: LIMIT_MESSAGES.policy }, { status: 429 });
    }
    const result = await addPolicy({
      orgId: user.organizationId,
      userId: user.id,
      title,
      text,
    });

    return NextResponse.json({ ok: true, ...result });
    } catch (error) {
    console.error("Add policy failed:", error?.message || error);
    return NextResponse.json({ error: "Could not save the policy" }, { status: 500 });
 
  }
}