import { useQuery } from "@tanstack/react-query";
import { fetchWaitlist } from "../api/client";
import { WaitlistTable } from "../components/WaitlistTable";
import type { WaitlistEntry } from "../api/types";
import { useMemo, useState } from "react";

type RoleFilter = "ALL" | "ARTISAN" | "CUSTOMER" | "BOTH";
type ContactFilter = "ALL" | "YES" | "NO";

export function WaitlistPage() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery<WaitlistEntry[], Error>({
    queryKey: ["waitlist"],
    queryFn: fetchWaitlist
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (roleFilter !== "ALL" && row.role !== roleFilter) return false;
      if (contactFilter === "YES" && !row.agreesToContact) return false;
      if (contactFilter === "NO" && row.agreesToContact) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${row.fullName} ${row.email} ${row.city} ${row.country} ${row.serviceInterest}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [data, roleFilter, contactFilter, search]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Waitlist</h2>
          <p className="page-subtitle">
            Live view of users who have expressed interest in Kraftigo.
          </p>
        </div>
        {data && (
          <div className="badge">
            Total signups:&nbsp;
            <strong>{data.length}</strong>
          </div>
        )}
      </header>

      <section className="table-card">
        <div className="table-header">
          <div>
            <div className="table-title">Waitlist signups</div>
            <div className="table-subtitle">
              Powered by the admin waitlist API (
              <code>/api/admin/waitlist</code>).
            </div>
          </div>
          <div className="filters-row">
            <input
              type="text"
              className="textfield"
              placeholder="Search name, email, city, interest…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            >
              <option value="ALL">All roles</option>
              <option value="ARTISAN">Krafters</option>
              <option value="CUSTOMER">Customers</option>
              <option value="BOTH">Both</option>
            </select>
            <select
              className="select"
              value={contactFilter}
              onChange={(e) =>
                setContactFilter(e.target.value as ContactFilter)
              }
            >
              <option value="ALL">Contact preference</option>
              <option value="YES">Can contact</option>
              <option value="NO">Do not contact</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="spinner-row">
            <div className="spinner" />
            <span className="page-subtitle">Loading latest waitlist…</span>
          </div>
        )}

        {isError && (
          <div className="error-state">
            <div className="page-subtitle">
              Unable to load waitlist entries.{" "}
              <span style={{ color: "#fecaca" }}>
                {(error && error.message) || "Unknown error"}
              </span>
            </div>
          </div>
        )}

        {!isLoading && !isError && <WaitlistTable rows={filtered} />}
      </section>
    </div>
  );
}

