import AppHeader from "../components/AppHeader";
import Charts from "./Charts";
import AdminTable from "./AdminTable";
import { statusSteps } from "../data";
import { getComplaints } from "@/lib/complaints";
import { getOrganizationById } from "@/lib/organizations";
import { requireStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireStaff();
  const org = await getOrganizationById(user.organizationId);
  const complaints = await getComplaints(user.organizationId);

  const total = complaints.length;
  const high = complaints.filter((c) => c.priority === "High").length;
  const duplicates = complaints.filter((c) => c.duplicateOf).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <>
      <AppHeader user={user} orgName={org?.name} />
      <main className="app-main">
        <h1 className="page-title">Admin dashboard</h1>
        <p className="page-sub">
          {org?.name} · AI suggestions help you prioritise. Final decisions
          stay with you.
        </p>

        <div className="stat-row">
          <div className="stat-card">
            <span>Total complaints</span>
            <strong>{total}</strong>
          </div>
          <div className="stat-card">
            <span>High priority</span>
            <strong>{high}</strong>
          </div>
          <div className="stat-card">
            <span>Possible duplicates</span>
            <strong>{duplicates}</strong>
          </div>
          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>
        </div>

        <Charts complaints={complaints} />

        <AdminTable
          complaints={complaints}
          statuses={statusSteps}
          departments={org?.departments || []}
          categories={org?.categories || []}
          canReassign={user.role === "admin"}
        />
      </main>
    </>
  );
}