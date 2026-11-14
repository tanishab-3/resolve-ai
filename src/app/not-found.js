import Link from "next/link";

export default function NotFound() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Page not found</h1>
        <p className="auth-sub">
          We could not find what you were looking for.
        </p>
        <Link href="/" className="button auth-button">
          Go to home page
        </Link>
      </div>
    </main>
  );
}