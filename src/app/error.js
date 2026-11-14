"use client";

import Link from "next/link";

export default function ErrorPage({ reset }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Something went wrong</h1>
        <p className="auth-sub">
          An unexpected error occurred. You can try again or go back to the
          home page.
        </p>
        <button type="button" className="button auth-button" onClick={() => reset()}>
          Try again
        </button>
        <p className="auth-switch">
          <Link href="/">Go to home page</Link>
        </p>
      </div>
    </main>
  );
}