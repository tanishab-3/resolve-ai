"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";
import PasswordField from "../components/PasswordField";

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

function passwordStrength(password) {
  if (password.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function SignupForm({ orgs }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [organizationId, setOrganizationId] = useState(
    orgs[0] ? String(orgs[0].id) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const score = passwordStrength(password);
  const mismatch = confirm.length > 0 && confirm !== password;
  const matches = confirm.length > 0 && confirm === password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

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
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization">Organisation</label>
            <select
              id="organization"
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <PasswordField
            id="password"
            label="Password (at least 8 characters)"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password.length > 0 && (
            <div className={`strength s${score}`}>
              <div className="strength-bars">
                {[1, 2, 3, 4].map((n) => (
                  <span key={n} className={n <= score ? "fill" : ""} />
                ))}
              </div>
              <div className="strength-label">{STRENGTH_LABELS[score]}</div>
            </div>
          )}

          <PasswordField
            id="confirm"
            label="Confirm password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {mismatch && <p className="field-error">Passwords do not match.</p>}
          {matches && <p className="field-ok">Passwords match.</p>}

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