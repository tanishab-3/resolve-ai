import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (!user.isPlatformAdmin) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const body = await request.json();
    const id = Number(body.organizationId);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Bad organisation" }, { status: 400 });
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!org) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("active_org", String(org.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("Switch organisation failed:", error?.message || error);
    return NextResponse.json({ error: "Could not switch" }, { status: 500 });
  }
}