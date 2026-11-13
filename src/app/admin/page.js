import AppHeader from "../components/AppHeader";
import ComplaintActions from "./ComplaintActions";
import { statusSteps, statusClass, priorityClass } from "../data";
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

        <div className="panel table-panel">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>AI priority</th>
                  <th>Status</th>
                  <th>Duplicate check</th>
                  <th>Update (status · department)</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={7}>No complaints yet.</td>
                  </tr>
                )}
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td>
                      <strong>{c.title}</strong>
                      <small>{c.location}</small>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      <span className={`prio ${priorityClass(c.priority)}`}>
                        {c.priority}
                      </span>
                      <small>{c.priorityReason}</small>
                    </td>
                    <td>
                      <span className={`pill ${statusClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.duplicateOf ? (
                        <span className="dup-tag">
                          Similar to {c.duplicateOf} (
                          {Math.round(c.duplicateScore * 100)}%)
                        </span>
                      ) : (
                        <span className="no-dup">No duplicates</span>
                      )}
                    </td>
                    <td>
                      <ComplaintActions
                        rowId={c.rowId}
                        status={c.status}
                        department={c.department}
                        statuses={statusSteps}
                        departments={org?.departments || []}
                        canReassign={user.role === "admin"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}