
const features = [
  {
    number: "01",
    icon: "✦",
    title: "AI-Powered Classification",
    description:
      "Automatically understands complaints and categorises them into the right departments.",
  },
  {
    number: "02",
    icon: "⌕",
    title: "Smart Duplicate Detection",
    description:
      "Identifies similar complaints so recurring problems can be handled together.",
  },
  {
    number: "03",
    icon: "◷",
    title: "Transparent Tracking",
    description:
      "Keep users informed with clear complaint statuses and resolution updates.",
  },
];

const steps = [
  {
    number: "01",
    title: "Submit a complaint",
    description: "Describe your issue and tell us where it happened.",
  },
  {
    number: "02",
    title: "AI analyses it",
    description: "ResolveAI organises the complaint and suggests its priority.",
  },
  {
    number: "03",
    title: "Get it resolved",
    description: "The concerned team reviews the issue and updates its progress.",
  },
];
const organisations = [
  { icon: "▣", name: "Colleges", text: "Maintenance, IT, safety and academic grievances." },
  { icon: "◉", name: "Municipalities", text: "Roads, water supply, sanitation and street lighting." },
  { icon: "✚", name: "Hospitals", text: "Patient care, facilities, billing and hygiene." },
];

const principles = [
  { icon: "◈", name: "Humans decide", text: "The AI suggests priority and department. People make every final decision." },
  { icon: "◎", name: "Explainable", text: "Every priority comes with a short reason, so staff can check it." },
  { icon: "▤", name: "Separated by organisation", text: "Each organisation sees only its own complaints and policies." },
];
export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <a href="/" className="brand">
          <span className="brand-icon">R</span>
          <span>Resolve<span className="brand-highlight">AI</span></span>
        </a>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <a href="/login" className="login-link">Log in</a>
          <a href="/signup" className="button button-small">Get started <span>↗</span></a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot"></span>
            INTELLIGENT GRIEVANCE MANAGEMENT
          </div>

          <h1>
            Every concern<br />
            deserves a <span>resolution.</span>
          </h1>

          <p className="hero-description">
            A smarter way to raise concerns, track complaints and bring
            organisations closer to the people they serve.
          </p>

          <div className="hero-actions">
            <a href="/signup" className="button">
              Submit a complaint <span>→</span>
            </a>
            <a href="/login" className="secondary-button">
              Track your complaint <span>↗</span>
            </a>
          </div>

          <div className="hero-note">
            <span className="note-check">✓</span>
            Transparent. Intelligent. Accountable.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow"></div>
          <div className="dashboard-preview">
            <div className="preview-top">
              <div>
                <span className="preview-label">RESOLVEAI OVERVIEW</span>
                <h3>Grievance insights</h3>
              </div>
              <span className="live-tag"><span></span> sample preview</span>
            </div>

            <div className="preview-stats">
              <div className="stat-box">
                <span>Total complaints</span>
                <strong>248</strong>
                <small>All submitted issues</small>
              </div>
              <div className="stat-box">
                <span>Resolved</span>
                <strong>186</strong>
                <small className="positive">Resolution progress</small>
              </div>
            </div>

            <div className="preview-heading">
              <strong>Recent activity</strong>
              <span>Illustrative data</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon blue">⌂</span>
              <div className="activity-info">
                <strong>Infrastructure issue</strong>
                <small>Water cooler · Second floor</small>
              </div>
              <span className="pill pending">In review</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon purple">⌘</span>
              <div className="activity-info">
                <strong>Technical issue</strong>
                <small>Wi-Fi · Library</small>
              </div>
              <span className="pill progress">Assigned</span>
            </div>

            <div className="activity-row">
              <span className="activity-icon green">✓</span>
              <div className="activity-info">
                <strong>Maintenance request</strong>
                <small>Classroom · Block A</small>
              </div>
              <span className="pill resolved">Resolved</span>
            </div>

            <div className="ai-insight">
              <span className="ai-sparkle">✦</span>
              <div>
                <strong>AI insight</strong>
                <p>Similar infrastructure complaints can be grouped for faster review.</p>
              </div>
            </div>
          </div>
          <div className="floating-label"><span>✦</span> Powered by AI</div>
        </div>
      </section>

      <section className="trust-strip">
        <span>BUILT FOR SMARTER GRIEVANCE MANAGEMENT</span>
        <div>
          <span>◈ Intelligent analysis</span>
          <span>◷ Faster tracking</span>
          <span>◎ Greater transparency</span>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading">
          <span className="section-label">WHY RESOLVEAI</span>
          <h2>More than a complaint portal.</h2>
          <p>
            We combine intelligent automation with transparent workflows
            to make grievance management simpler.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-top">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-number">{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-label">SIMPLE PROCESS</span>
          <h2>From concern to resolution.</h2>
          <p>A clear process that keeps everyone informed at every step.</p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <span className="section-label">ONE PLATFORM</span>
          <h2>Built for any organisation.</h2>
          <p>Each organisation gets its own categories, departments and policies.</p>
        </div>
        <div className="org-grid">
          {organisations.map((o) => (
            <article className="feature-card" key={o.name}>
              <span className="feature-icon">{o.icon}</span>
              <h3>{o.name}</h3>
              <p>{o.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="section-heading">
          <span className="section-label">RESPONSIBLE BY DESIGN</span>
          <h2>AI that assists, never decides.</h2>
        </div>
        <div className="org-grid">
          {principles.map((p) => (
            <div className="step-card" key={p.name}>
              <span className="step-number">{p.icon}</span>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta-section" id="about">
        <div>
          <span className="section-label">A BETTER WAY FORWARD</span>
          <h2>Make your voice count.</h2>
          <p>Raise an issue. Follow its progress. Be part of the solution.</p>
        </div>
        <a href="/signup" className="button cta-button">
          Get started <span>→</span>
        </a>
      </section>

      <footer className="footer">
        <a href="/" className="brand">
          <span className="brand-icon">R</span>
          <span>Resolve<span className="brand-highlight">AI</span></span>
        </a>
        <p>Smarter grievance management, built around people.</p>
        <span>© 2026 ResolveAI. All rights reserved.</span>
                <a href="https://github.com/tanishab-3/resolve-ai" className="footer-link">
          View source on GitHub ↗
        </a>
      </footer>
    </main>
  );
}
