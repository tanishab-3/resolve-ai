"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";

export default function SignupForm({ orgs }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState(
    orgs[0] ? String(orgs[0].id) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, organization_id: organizationId },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError("Account created. Please confirm your email, then log in.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand">
          <span className="brand-icon">R</span>
          <span>
            Resolve<span className="brand-highlight">AI</span>
          </span>
        </Link>

        <h1>Create your account</h1>
        <p className="auth-sub">Raise concerns and follow their progress.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Organisation</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password (at least 8 characters)</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="button auth-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}{" "}
            <span>→</span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}