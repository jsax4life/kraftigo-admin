import type { WaitlistEntry } from "../api/types";

type Props = {
  rows: WaitlistEntry[];
};

export function WaitlistTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="page-subtitle">
          No one is currently on the waitlist. Once users sign up via the
          landing page, they will appear here for admin review.
        </div>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Full name</th>
            <th>Email</th>
            <th>Country / City</th>
            <th>Role</th>
            <th>Service interest</th>
            <th>Contact OK</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.fullName}</td>
              <td>{r.email}</td>
              <td>
                {r.city}, {r.country}
              </td>
              <td>
                <RolePill role={r.role} />
              </td>
              <td>{r.serviceInterest}</td>
              <td>
                <ContactPill agrees={r.agreesToContact} />
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolePill({ role }: { role: WaitlistEntry["role"] }) {
  const base = "pill ";
  if (role === "ARTISAN") {
    return <span className={base + "pill-role-artisan"}>Krafter</span>;
  }
  if (role === "CUSTOMER") {
    return <span className={base + "pill-role-customer"}>Customer</span>;
  }
  return <span className={base + "pill-role-both"}>Both</span>;
}

function ContactPill({ agrees }: { agrees: boolean }) {
  const base = "pill ";
  if (agrees) {
    return <span className={base + "pill-contact-yes"}>Agreed</span>;
  }
  return <span className={base + "pill-contact-no"}>Do not contact</span>;
}

