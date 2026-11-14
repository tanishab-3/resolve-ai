"use client";

import { useState } from "react";

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

          {result.sources.map((s) => (
            <div key={s.n} className={`source-item ${s.cited ? "cited" : ""}`}>
              <b>
                [{s.n}] {s.title}
                {s.cited && <span className="source-tag">used</span>}
              </b>
              {s.excerpt}
              <div className="hint">{Math.round(s.similarity * 100)}% match</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}