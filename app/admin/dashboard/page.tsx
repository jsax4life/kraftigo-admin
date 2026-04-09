export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          High-level overview of Kraftigo marketplace activity.
        </p>
      </div>
      {/* Metrics & charts scaffold – to be wired to real data services */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Users</p>
          <p className="mt-2 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Active Krafters</p>
          <p className="mt-2 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Open Bookings</p>
          <p className="mt-2 text-xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Waitlist Signups</p>
          <p className="mt-2 text-xl font-semibold">Live on Waitlist</p>
        </div>
      </div>
    </div>
  );
}

