import Link from "next/link";

export default function OrgSwitcher({ orgs, activeSlug, basePath }) {
  return (
    <div className="org-switcher">
      {orgs.map((org) => (
        <Link
          key={org.slug}
          href={`${basePath}?org=${org.slug}`}
          className={`org-tab ${org.slug === activeSlug ? "active" : ""}`}
        >
          {org.name}
        </Link>
      ))}
    </div>
  );
}