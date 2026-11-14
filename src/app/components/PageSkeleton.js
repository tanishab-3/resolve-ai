export default function PageSkeleton() {
  return (
    <>
      <nav className="navbar">
        <span className="skeleton skeleton-brand" />
      </nav>
      <main className="app-main">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-sub" />
        <div className="skeleton-cards">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
        <div className="skeleton skeleton-block" />
        <div className="skeleton skeleton-block" />
      </main>
    </>
  );
}