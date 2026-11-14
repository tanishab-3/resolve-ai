import { redirect } from "next/navigation";
import Link from "next/link";
import AppHeader from "../../components/AppHeader";
import PolicyManager from "./PolicyManager";
import { requireStaff } from "@/lib/auth/session";
import { getOrganizationById } from "@/lib/organizations";
import { listPolicies } from "@/lib/policies";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const user = await requireStaff();
  if (user.role !== "admin") redirect("/admin");

  const org = await getOrganizationById(user.organizationId);
  const policies = await listPolicies(user.organizationId);

  return (
    <>
      <AppHeader user={user} orgName={org?.name} />
      <main className="app-main">
        <Link href="/admin" className="back-link">
          ← Back to dashboard
        </Link>
        <h1 className="page-title">Policy documents</h1>
        <p className="page-sub">
          Add your organisation&apos;s rules. The policy assistant on each
          complaint page uses only these documents to suggest next steps.
        </p>
        <PolicyManager policies={policies} />
      </main>
    </>
  );
}