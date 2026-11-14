"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PolicyManager({ policies }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setText(await file.text());
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save the policy");

      setTitle("");
      setText("");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this policy document?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/policies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete");
      router.refresh();
    } catch {
      setError("Could not delete the policy. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <form className="panel policy-form" onSubmit={handleSubmit}>
        <h2 className="panel-title">Add a policy document</h2>

        <div className="form-group">
          <label htmlFor="policy-title">Title</label>
          <input
            id="policy-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Maintenance and Repairs Policy"
            maxLength={200}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="policy-file">Upload a .txt or .md file (optional)</label>
          <input id="policy-file" type="file" accept=".txt,.md,text/plain" onChange={handleFile} />
        </div>

        <div className="form-group">
          <label htmlFor="policy-text">Policy text</label>
          <textarea
            id="policy-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the policy text here. Separate topics with a blank line."
            required
          />
          <small className="char-count">{text.length}/30000</small>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="button" disabled={saving}>
          {saving && <span className="spinner" />}
          {saving ? "Processing..." : "Save policy"}
        </button>
        {saving && (
          <p className="hint">Preparing the document for search. This can take up to a minute.</p>
        )}
      </form>

      <div className="policy-list">
        {policies.length === 0 && (
          <p className="hint">No policy documents yet. Add your first one above.</p>
        )}
        {policies.map((p) => (
          <div className="policy-item" key={p.id}>
            <div>
              <strong>{p.title}</strong>
              <small>
                Added {p.date} · {p.pieces} searchable pieces
              </small>
            </div>
            <button
              type="button"
              className="danger-button"
              disabled={deletingId === p.id}
              onClick={() => handleDelete(p.id)}
            >
              {deletingId === p.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}