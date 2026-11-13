import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AppHeader({ user, orgName }) {
  const isStaff = user?.role === "admin" || user?.role === "officer";

  return (
    <nav className="navbar">
      <Link href="/" className="brand">
        <span className="brand-icon">R</span>
        <span>
          Resolve<span className="brand-highlight">AI</span>
        </span>
      </Link>

      <div className="nav-links">
        {isStaff ? (
          <Link href="/admin">Admin dashboard</Link>
        ) : (
          <>
            <Link href="/dashboard">My complaints</Link>
            <Link href="/complaints/new">New complaint</Link>
          </>
        )}
      </div>

      <div className="nav-actions">
        <span className="user-chip">
          {user?.fullName || user?.email}
          {orgName ? ` · ${orgName}` : ""}
        </span>
        <LogoutButton />
      </div>
    </nav>
  );
}