"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ComplaintActions from "./ComplaintActions";
import { statusClass, priorityClass } from "../data";

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

export default function AdminTable({
  complaints,
  statuses,
  departments,
  categories,
  canReassign,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();

    const list = complaints.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      if (duplicatesOnly && !c.duplicateOf) return false;
      if (q) {
        const haystack =
          `${c.id} ${c.title} ${c.location} ${c.category} ${c.department}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sort === "priority") {
        const diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        if (diff !== 0) return diff;
      }
      if (sort === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [complaints, search, statusFilter, priorityFilter, categoryFilter, duplicatesOnly, sort]);

  const filtersActive =
    search ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    duplicatesOnly;

  function reset() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setDuplicatesOnly(false);
  }

  return (
    <div className="panel table-panel">
      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search by ID, title, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">High priority first</option>
        </select>
        <label className="check-filter">
          <input
            type="checkbox"
            checked={duplicatesOnly}
            onChange={(e) => setDuplicatesOnly(e.target.checked)}
          />
          Duplicates only
        </label>
        {filtersActive && (
          <button type="button" className="reset-button" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>

      <div className="result-count">
        Showing {visible.length} of {complaints.length} complaints
      </div>

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
            {visible.length === 0 && (
              <tr>
                <td colSpan={7}>No complaints match these filters.</td>
              </tr>
            )}
            {visible.map((c) => (
              <tr key={c.rowId}>
                <td className="mono">{c.id}</td>
                <td>
                  <strong>
                    <Link href={`/admin/complaints/${c.rowId}`} className="row-link">
                      {c.title}
                    </Link>
                  </strong>
                  <small>{c.location}</small>
                </td>
                <td>{c.category}</td>
                <td>
                  <span className={`prio ${priorityClass(c.priority)}`}>{c.priority}</span>
                  <small>{c.priorityReason}</small>
                </td>
                <td>
                  <span className={`pill ${statusClass(c.status)}`}>{c.status}</span>
                </td>
                <td>
                  {c.duplicateOf ? (
                    <Link href={`/admin/complaints/${c.duplicateRowId}`} className="dup-tag">
                      Similar to {c.duplicateOf} ({Math.round(c.duplicateScore * 100)}%)
                    </Link>
                  ) : (
                    <span className="no-dup">No duplicates</span>
                  )}
                </td>
                <td>
                  <ComplaintActions
                    rowId={c.rowId}
                    status={c.status}
                    department={c.department}
                    statuses={statuses}
                    departments={departments}
                    canReassign={canReassign}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}