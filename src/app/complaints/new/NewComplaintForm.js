"use client";

import { useState } from "react";
import Link from "next/link";
import { priorityClass } from "../../data";

export default function NewComplaintForm() {
  const [form, setForm] = useState({ title: "", location: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      const analysis = await res.json();
      setResult({ id: analysis.id, analysis });
    } catch (err) {
      setError("Could not analyse the complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-main">
      <div className="narrow">
        <h1 className="page-title">Submit a complaint</h1>
        <p className="page-sub">
          Describe the problem clearly. Our AI will organise it for the right
          team.
        </p>

        {result ? (
          <div className="panel">
            <div className="success-panel">
              <span className="success-icon">✓</span>
              <h2>Complaint submitted</h2>
              <p>
                Your complaint ID is <strong>{result.id}</strong>.
              </p>
            </div>

            <div className="ai-result">
              <strong className="ai-result-title">✦ AI suggestion</strong>
              <div className="ai-row">
                <span>Category</span>
                <b>
                  {result.analysis.category} · {result.analysis.subcategory}
                </b>
              </div>
              <div className="ai-row">
                <span>Priority</span>
                <b>
                  <span
                    className={`prio ${priorityClass(result.analysis.priority)}`}
                  >
                    {result.analysis.priority}
                  </span>
                </b>
              </div>
              <div className="ai-row">
                <span>Why</span>
                <b>{result.analysis.priorityReason}</b>
              </div>
              <div className="ai-row">
                <span>Department</span>
                <b>{result.analysis.department}</b>
              </div>
              <div className="ai-row">
                <span>Summary</span>
                <b>{result.analysis.summary}</b>
              </div>
              {result.analysis.duplicate && (
                <div className="ai-row">
                  <span>Possible duplicate</span>
                  <b>
                    {result.analysis.duplicate.id}:{" "}
                    {result.analysis.duplicate.title} (
                    {Math.round(result.analysis.duplicate.similarity * 100)}%
                    similar)
                  </b>
                </div>
              )}
              <p className="ai-note">
                This is an AI suggestion. An administrator will review it before
                any action is taken.
              </p>
            </div>

            <Link href="/dashboard" className="button">
              Go to my complaints <span>→</span>
            </Link>
          </div>
        ) : (
          <form className="panel" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Water cooler not working"
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Second floor, Block A"
                required
              />
            </div>
            <div className="form-group">
              <label>Describe the problem</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="What happened? Since when? Who is affected?"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="button" disabled={loading}>
              {loading ? "Analysing with AI..." : "Submit complaint"}{" "}
              <span>→</span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}