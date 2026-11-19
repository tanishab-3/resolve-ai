import Link from "next/link";
import LogoutButton from "./LogoutButton";
import OrgMenu from "./OrgMenu";
import { getOrganizations } from "@/lib/organizations";

export default async function AppHeader({ user, orgName }) {
  const isStaff = user?.role === "admin" || user?.role === "officer";
  const orgs = user?.isPlatformAdmin ? await getOrganizations() : [];

  return (
    <nav className="navbar app-navbar">
      <Link href="/" className="brand">
        <span className="brand-icon">R</span>
        <span>
          Resolve<span className="brand-highlight">AI</span>
        </span>
      </Link>

      <div className="nav-links">
        {isStaff ? (
          <>
            <Link href="/admin">Admin dashboard</Link>
            {user?.role === "admin" && (
              <Link href="/admin/policies">Policies</Link>
            )}
          </>
        ) : (
          <>
            <Link href="/dashboard">My complaints</Link>
            <Link href="/complaints/new">New complaint</Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        {user?.isPlatformAdmin ? (
          <OrgMenu
            userName={user.fullName || user.email}
            orgs={orgs.map((o) => ({ id: o.id, name: o.name }))}
            activeOrgId={user.organizationId}
          />
        ) : (
          <span className="user-chip">
            {user?.fullName || user?.email}
            {orgName ? ` · ${orgName}` : ""}
          </span>
        )}
        <LogoutButton />
      </div>
    </nav>
  );
}