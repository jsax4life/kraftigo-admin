"use client";

import { useWaitlist } from "@/hooks/useWaitlist";
import { DataTable } from "@/components/tables/data-table";
import { waitlistColumns } from "@/components/tables/waitlist-columns";
import { CsvExportButton } from "@/components/ui/csv-export-button";
import { useTableFilters } from "@/hooks/useTableFilters";
import { waitlistService } from "@/services/waitlist.service";
import type { WaitlistEntry } from "@/types/waitlist";

export default function WaitlistPage() {
  const { data, isLoading, isError, error } = useWaitlist();
  const { search, setSearch, roleFilter, setRoleFilter, contactFilter, setContactFilter, applyFilters } =
    useTableFilters();

  const filtered: WaitlistEntry[] = applyFilters(data ?? []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Waitlist</h1>
          <p className="text-sm text-slate-400">
            Live view of users who joined the Kraftigo waitlist.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {data && (
            <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              Total signups:{" "}
              <span className="font-semibold">{data.length}</span>
            </span>
          )}
          <CsvExportButton
            label="Export waitlist CSV"
            onExport={() => waitlistService.exportCsv()}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
        <input
          className="h-8 w-56 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-emerald-400"
          placeholder="Search name, email, city, interest…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="h-8 rounded-md border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-emerald-400"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
        >
          <option value="ALL">All roles</option>
          <option value="ARTISAN">Krafters</option>
          <option value="CUSTOMER">Customers</option>
          <option value="BOTH">Both</option>
        </select>
        <select
          className="h-8 rounded-md border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-emerald-400"
          value={contactFilter}
          onChange={(e) =>
            setContactFilter(e.target.value as typeof contactFilter)
          }
        >
          <option value="ALL">Contact preference</option>
          <option value="YES">Can contact</option>
          <option value="NO">Do not contact</option>
        </select>
      </div>

      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
          <div className="divide-y divide-slate-900">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 text-xs"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-40 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-28 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-32 animate-pulse rounded bg-slate-800/80" />
              </div>
            ))}
          </div>
        </div>
      )}
      {isError && (
        <p className="text-xs text-rose-300">
          Failed to load waitlist: {error?.message || "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {!data?.length ? (
            <p className="text-xs text-slate-400">
              No one is currently on the waitlist. Once users sign up, they
              will appear here for review.
            </p>
          ) : (
            <DataTable columns={waitlistColumns} data={filtered} />
          )}
        </>
      )}
    </div>
  );
}

