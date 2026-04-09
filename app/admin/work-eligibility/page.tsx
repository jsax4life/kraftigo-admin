"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/tables/data-table";
import { workEligibilityColumns } from "@/components/tables/work-eligibility-columns";
import { useWorkEligibilityList } from "@/hooks/useWorkEligibilityList";
import type { WorkEligibilityStatus } from "@/types/work-eligibility";

const STATUS_FILTER_OPTIONS: { value: "" | WorkEligibilityStatus; label: string }[] =
  [
    { value: "", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" }
  ];

export default function WorkEligibilityAdminPage() {
  const [statusFilter, setStatusFilter] = useState<"" | WorkEligibilityStatus>("");
  const [userIdFilter, setUserIdFilter] = useState("");

  const listParams = useMemo(() => {
    const status = statusFilter || undefined;
    const uid = userIdFilter.trim() || undefined;
    if (!status && !uid) return undefined;
    return { status, userId: uid };
  }, [statusFilter, userIdFilter]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useWorkEligibilityList(listParams);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Work eligibility</h1>
          <p className="text-sm text-slate-400">
            Review documents Krafters upload to prove they can work. Approve or
            reject with a reason.
          </p>
        </div>
        <Link
          href="/admin/krafters"
          className="text-xs text-slate-400 hover:text-emerald-300"
        >
          ← Back to Krafters
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">
            Status
          </span>
          <select
            className="h-8 min-w-[140px] rounded-md border border-slate-700 bg-slate-950 px-2 text-xs outline-none focus:border-emerald-400"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "" | WorkEligibilityStatus)
            }
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">
            Krafter user ID (UUID)
          </span>
          <input
            className="h-8 w-64 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-[11px] outline-none focus:border-emerald-400"
            placeholder="Optional filter by krafter UUID"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => refetch()}
          className="h-8 rounded-md border border-slate-700 bg-slate-950 px-3 text-xs hover:border-emerald-400"
        >
          Refresh
        </button>
        {data && (
          <span className="ml-auto rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-[10px] text-slate-300">
            {isFetching ? "Updating…" : `${data.length} submission(s)`}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
          <div className="divide-y divide-slate-900">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 text-xs"
              >
                <div className="h-3 w-32 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-800/80" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && (
        <p className="text-xs text-rose-300">
          Failed to load submissions: {error?.message || "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {!data?.length ? (
            <p className="text-xs text-slate-400">
              No submissions match the current filters.
            </p>
          ) : (
            <DataTable columns={workEligibilityColumns} data={data} />
          )}
        </>
      )}
    </div>
  );
}
