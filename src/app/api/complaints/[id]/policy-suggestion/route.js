import { consumeQuota, LIMIT_MESSAGES } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrganizationById } from "@/lib/organizations";
import { complaintText, embedText } from "@/lib/embeddings";
import {
  countPolicies,
  retrieveChunks,
  suggestFromPolicies,
} from "@/lib/policies";

export const maxDuration = 60;

export async function POST(_request, { params }) {
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

    const { data: complaint } = await supabase
      .from("complaints")
      .select("id, title, location, description, created_at")
      .eq("id", rowId)
      .eq("organization_id", user.organizationId)
      .maybeSingle();

    if (!complaint) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if ((await countPolicies(user.organizationId)) === 0) {
      return NextResponse.json({ noPolicies: true });
    }
    if (!(await consumeQuota(user.id, "suggestion"))) {
      return NextResponse.json({ error: LIMIT_MESSAGES.suggestion }, { status: 429 });
    }
    const org = await getOrganizationById(user.organizationId);
    const embedding = await embedText(complaintText(complaint));
    const chunks = await retrieveChunks(embedding, user.organizationId);

    if (chunks.length === 0) {
      return NextResponse.json({
        covered: false,
        suggestedAction:
          "No relevant policy was found for this complaint. Use your own judgement.",
        sources: [],
      });
    }

    const daysAgo = Math.floor(
      (Date.now() - new Date(complaint.created_at).getTime()) / 86400000
    );

    const result = await suggestFromPolicies({
      org,
      complaint: { ...complaint, daysAgo },
      chunks,
    });

    const used = Array.isArray(result.usedSources) ? result.usedSources : [];

    return NextResponse.json({
      covered: Boolean(result.covered),
      suggestedAction: result.suggestedAction,
      sources: chunks.map((c, i) => ({
        n: i + 1,
        title: c.title,
        excerpt: c.content.length > 450 ? c.content.slice(0, 450) + "…" : c.content,
        similarity: c.similarity,
        cited: used.includes(i + 1),
      })),
    });
  } catch (error) {
    console.error("Policy suggestion failed:", error?.message || error);
    return NextResponse.json({ error: "Could not get a suggestion" }, { status: 500 });
  }
}