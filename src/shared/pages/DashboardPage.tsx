export function DashboardPage() {
  // Placeholder metrics; in a real setup this would come from analytics APIs
  const stats = [
    { label: "Total Users", value: "—" },
    { label: "Active Krafters", value: "—" },
    { label: "Open Orders", value: "—" },
    { label: "Waitlist Signups", value: "Live from API on /waitlist" }
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Overview</h2>
          <p className="page-subtitle">
            High-level view of Kraftigo marketplace health and growth.
          </p>
        </div>
      </header>
      <section className="cards-grid">
        {stats.map((s) => (
          <article key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </article>
        ))}
      </section>
    </div>
  );
}

