import { Link, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";

const NAV_ITEMS = [
  { path: "/", label: "Overview" },
  { path: "/waitlist", label: "Waitlist" }
  // Future: /users, /marketplace, /metrics, /settings, etc.
];

export function AdminLayout({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-dot" />
          <span className="logo-text">Kraftigo Admin</span>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={active ? "nav-item nav-item-active" : "nav-item"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-footnote">Internal use only</span>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <h1 className="topbar-title">Kraftigo Control Center</h1>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}

