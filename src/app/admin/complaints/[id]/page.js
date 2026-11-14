import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "../../../components/AppHeader";
import ComplaintActions from "../../ComplaintActions";
import { statusSteps, statusClass, priorityClass } from "../../../data";
import { getComplaintById } from "@/lib/complaints";
import { getOrganizationById } from "@/lib/organizations";
import { requireStaff } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ComplaintDetailPage({ params }) {
  const user = await requireStaff();
  const { id } = await params;
  const rowId = Number(id);
  if (!Number.isInteger(rowId)) notFound();

  const org = await getOrganizationById(user.organizationId);
  const c = await getComplaintById(rowId, user.organizationId);
  if (!c) notFound();

  const currentIndex = statusSteps.indexOf(c.status);

  return (
    <>
      <AppHeader user={user} orgName={org?.name} />
      <main className="app-main">
        <Link href="/admin" className="back-link">
          ← Back to dashboard
        </Link>

        <div className="detail-head">
          <div>
            <span className="complaint-id">{c.id}</span>
            <h1 className="page-title">{c.title}</h1>
            <p className="page-sub">
              {c.location} · Submitted {c.date}
            </p>
          </div>
          <div className="detail-badges">
            <span className={`prio ${priorityClass(c.priority)}`}>
              {c.priority} priority
            </span>
            <span className={`pill ${statusClass(c.status)}`}>{c.status}</span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            <section className="panel">
              <h2 className="panel-title">Complaint</h2>
              <p className="detail-text">{c.description}</p>
            </section>

            <section className="panel">
              <h2 className="panel-title">✦ AI analysis</h2>
              <div className="ai-row">
                <span>Category</span>
                <b>
                  {c.category}
                  {c.subcategory ? ` · ${c.subcategory}` : ""}
                </b>
              </div>
              <div className="ai-row">
                <span>Priority</span>
                <b>{c.priority}</b>
              </div>
              <div className="ai-row">
                <span>Reason</span>
                <b>{c.priorityReason}</b>
              </div>
              <div className="ai-row">
                <span>Suggested department</span>
                <b>{c.department}</b>
              </div>
              <div className="ai-row">
                <span>Summary</span>
                <b>{c.summary}</b>
              </div>
              <p className="ai-note">
                These are AI suggestions. Review them before taking action.
              </p>
            </section>
          </div>

          <aside className="detail-side">
            <section className="panel">
              <h2 className="panel-title">Progress</h2>
              <div className="tracker">
                {statusSteps.map((step, i) => (
                  <div
                    key={step}
                    className={`tracker-step ${i <= currentIndex ? "done" : ""}`}
                  >
                    <span className="tracker-dot"></span>
                    {step}
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title">Update</h2>
              <ComplaintActions
                rowId={c.rowId}
                status={c.status}
                department={c.department}
                statuses={statusSteps}
                departments={org?.departments || []}
                canReassign={user.role === "admin"}
              />
            </section>

            <section className="panel">
              <h2 className="panel-title">Duplicate check</h2>
              {c.duplicateOf ? (
                <div className="dup-box">
                  <p className="hint">
                    {Math.round(c.duplicateScore * 100)}% similar to an earlier
                    complaint:
                  </p>
                  <Link href={`/admin/complaints/${c.duplicateRowId}`}>
                    {c.duplicateOf}
                    {c.duplicateTitle ? `: ${c.duplicateTitle}` : ""}
                  </Link>
                </div>
              ) : (
                <p className="hint">No similar complaints found.</p>
              )}
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}