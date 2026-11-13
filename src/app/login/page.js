"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // The dashboard page sends admins and officers to /admin
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

        <h1>Welcome back</h1>
        <p className="auth-sub">Log in to track your complaints.</p>

        <form onSubmit={handleSubmit}>
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
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="button auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"} <span>→</span>
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}