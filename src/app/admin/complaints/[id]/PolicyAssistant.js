"use client";

import { useState } from "react";

function SourceItem({ s }) {
  return (
    <div className={`source-item ${s.cited ? "cited" : ""}`}>
      <b>
        [{s.n}] {s.title}
        {s.cited && <span className="source-tag">used</span>}
      </b>
      {s.excerpt}
      <div className="hint">{Math.round(s.similarity * 100)}% match</div>
    </div>
  );
}

export default function PolicyAssistant({ rowId }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function ask() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/complaints/${rowId}/policy-suggestion`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not get a suggestion. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const used = result?.sources?.filter((s) => s.cited) ?? [];
  const others = result?.sources?.filter((s) => !s.cited) ?? [];

  return (
    <div>
      <button type="button" className="button full-width" onClick={ask} disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Searching policies..." : "Suggest from policies"}
      </button>

      {error && <p className="error-text" style={{ marginTop: 10 }}>{error}</p>}

      {result?.noPolicies && (
        <p className="hint">
          No policy documents have been added yet. An admin can add them under
          Policies.
        </p>
      )}

      {result && !result.noPolicies && (
        <div style={{ marginTop: 14 }}>
          <div className="assistant-answer">
            {result.suggestedAction}
            <p className="hint">
              AI suggestion based only on the policy excerpts below. Please
              check the sources before acting.
            </p>
          </div>

          {used.length === 0 && (
            <p className="hint">The assistant did not rely on any excerpt.</p>
          )}

          {used.map((s) => (
            <SourceItem key={s.n} s={s} />
          ))}

          {others.length > 0 && (
            <details className="other-sources">
              <summary>Other excerpts that were retrieved ({others.length})</summary>
              {others.map((s) => (
                <SourceItem key={s.n} s={s} />
              ))}
            </details>
          )}
        </div>
      )}
    </div>
  );
}