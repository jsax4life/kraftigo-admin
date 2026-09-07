"use client";

import { KrafterLocationsPanel } from "@/components/krafters/krafter-locations-panel";
import { StatCard } from "@/components/ui/stat-card";
import { useDashboardStats } from "@/hooks/useDashboardStats";

function formatCount(value: number | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString();
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          High-level overview of Kraftigo marketplace activity.
        </p>
      </div>

      {isError && (
        <p className="text-xs text-rose-300">
          Failed to load stats: {error?.message ?? "Unknown error"}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={isLoading ? "…" : formatCount(data?.totalUsers)}
        />
        <StatCard
          label="Active Krafters"
          value={isLoading ? "…" : formatCount(data?.activeKrafters)}
          hint="ARTISAN + ACTIVE"
          href="/admin/krafters"
        />
        <StatCard
          label="Open Bookings"
          value={isLoading ? "…" : formatCount(data?.openBookings)}
          href="/admin/bookings"
        />
        <StatCard
          label="Total Bookings"
          value={isLoading ? "…" : formatCount(data?.totalBookings)}
          href="/admin/bookings"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="All Krafters"
          value={isLoading ? "…" : formatCount(data?.allKrafters)}
          href="/admin/krafters"
        />
        <StatCard
          label="All Customers"
          value={isLoading ? "…" : formatCount(data?.allCustomers)}
          href="/admin/customers"
        />
        <StatCard
          label="Intent Krafters"
          value={isLoading ? "…" : formatCount(data?.intentKrafters)}
          hint="Started artisan onboarding"
          href="/admin/krafters?tab=intent"
        />
        <StatCard
          label="Waitlist"
          value="View"
          hint="Live signups"
          href="/admin/waitlist"
        />
      </div>

      <KrafterLocationsPanel />
    </div>
  );
}
