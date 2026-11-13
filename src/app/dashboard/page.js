import Link from "next/link";
import { redirect } from "next/navigation";
import AppHeader from "../components/AppHeader";
import { statusSteps, statusClass } from "../data";
import { getComplaints } from "@/lib/complaints";
import { getOrganizationById } from "@/lib/organizations";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role !== "citizen") redirect("/admin");

  const org = await getOrganizationById(user.organizationId);
  const complaints = await getComplaints(user.organizationId, user.id);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const inProgress = total - resolved;

  return (
    <>
      <AppHeader user={user} orgName={org?.name} />
      <main className="app-main">
        <div className="page-head">
          <div>
            <h1 className="page-title">My complaints</h1>
            <p className="page-sub">
              Track every complaint from submission to resolution.
            </p>
          </div>
          <Link href="/complaints/new" className="button">
            New complaint <span>+</span>
          </Link>
        </div>

        <div className="stat-row three">
          <div className="stat-card">
            <span>Total complaints</span>
            <strong>{total}</strong>
          </div>
          <div className="stat-card">
            <span>In progress</span>
            <strong>{inProgress}</strong>
          </div>
          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>
        </div>

        {total === 0 && (
          <div className="panel">
            <p className="page-sub">
              You haven't submitted any complaints yet. Submit your first one
              to see it here.
            </p>
          </div>
        )}

        <div className="complaint-list">
          {complaints.map((c) => {
            const currentIndex = statusSteps.indexOf(c.status);
            return (
              <article className="complaint-card" key={c.id}>
                <div className="complaint-top">
                  <span className="complaint-id">{c.id}</span>
                  <span className={`pill ${statusClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <h3>{c.title}</h3>
                <p>
                  {c.location} · {c.category} · {c.date}
                </p>

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
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}