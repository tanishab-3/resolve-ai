"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrgMenu({ userName, orgs, activeOrgId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const active = orgs.find((o) => o.id === activeOrgId);

  async function switchTo(id) {
    if (id === activeOrgId) {
      setOpen(false);
      return;
    }

    setSwitching(true);
    setError("");

    try {
      const res = await fetch("/api/switch-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: id }),
      });
           if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(`${res.status} ${data.error || ""}`.trim());
      }

      setOpen(false);
      router.push("/admin");
      router.refresh();
       } catch (err) {
      setError(`Could not switch (${err.message}). Try again.`);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className="org-menu" ref={ref}>
      <button
        type="button"
        className="org-menu-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {userName} · {active?.name || "Choose organisation"} ▾
      </button>

      {open && (
        <div className="org-menu-list" role="menu">
          <div className="org-menu-title">Switch organisation</div>
          {orgs.map((o) => (
            <button
              key={o.id}
              type="button"
              role="menuitem"
              className={`org-menu-item ${o.id === activeOrgId ? "active" : ""}`}
              disabled={switching}
              onClick={() => switchTo(o.id)}
            >
              {o.name}
              {o.id === activeOrgId && <span>✓</span>}
            </button>
          ))}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
    </div>
  );
}