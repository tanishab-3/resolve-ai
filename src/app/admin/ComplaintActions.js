"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ComplaintActions({
  rowId,
  status,
  department,
  statuses,
  departments,
  canReassign,
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const departmentOptions = departments.includes(department)
    ? departments
    : [department, ...departments];

  async function update(change) {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch(`/api/complaints/${rowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(change),
      });
      if (!res.ok) throw new Error("Request failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="actions-cell">
      <select
        value={status}
        disabled={saving}
        onChange={(e) => update({ status: e.target.value })}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={department}
        disabled={saving || !canReassign}
        onChange={(e) => update({ department: e.target.value })}
        title={canReassign ? "" : "Only admins can reassign departments"}
      >
        {departmentOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {saved && <small className="saved-text">Saved ✓</small>}
      {error && <small className="error-text">{error}</small>}
    </div>
  );
}