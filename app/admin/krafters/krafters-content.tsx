"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/tables/data-table";
import {
  adminUserColumns,
  intentKrafterColumns
} from "@/components/tables/admin-user-columns";
import {
  useAdminIntentKrafters,
  useAdminKrafters
} from "@/hooks/useAdminKrafters";

type KrafterTab = "all" | "intent";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
      <div className="divide-y divide-slate-900">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex gap-3 px-3 py-2">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-800/80" />
            <div className="h-3 w-40 animate-pulse rounded bg-slate-800/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KraftersPageContent() {
  const searchParams = useSearchParams();
  const tab: KrafterTab =
    searchParams.get("tab") === "intent" ? "intent" : "all";

  const krafters = useAdminKrafters();
  const intentKrafters = useAdminIntentKrafters();

  const activeQuery = tab === "intent" ? intentKrafters : krafters;
  const columns = tab === "intent" ? intentKrafterColumns : adminUserColumns;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Krafters</h1>
        <p className="text-sm text-slate-400">
          Artisan accounts from{" "}
          <code className="text-[11px]">/api/admin/users/krafters</code> with
          profiles from{" "}
          <code className="text-[11px]">/api/admin/profiles/artisans</code>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Link
          href="/admin/krafters"
          className={`rounded-full px-3 py-1.5 ${
            tab === "all"
              ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-emerald-400"
          }`}
        >
          All Krafters
        </Link>
        <Link
          href="/admin/krafters?tab=intent"
          className={`rounded-full px-3 py-1.5 ${
            tab === "intent"
              ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-emerald-400"
          }`}
        >
          Intent Krafters
        </Link>
      </div>

      {activeQuery.isLoading && <TableSkeleton />}
      {activeQuery.isError && (
        <p className="text-xs text-rose-300">
          Failed to load krafters:{" "}
          {activeQuery.error?.message ?? "Unknown error"}
        </p>
      )}
      {!activeQuery.isLoading && !activeQuery.isError && (
        <>
          {!activeQuery.data?.length ? (
            <p className="text-xs text-slate-400">No krafters found.</p>
          ) : (
            <DataTable columns={columns} data={activeQuery.data} />
          )}
        </>
      )}

      <Link
        href="/admin/work-eligibility"
        className="block max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-emerald-500/40 hover:bg-slate-900"
      >
        <h2 className="text-sm font-medium text-slate-100">
          Work eligibility documents
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Review, approve, or reject work-eligibility uploads from Krafters.
        </p>
        <span className="mt-2 inline-block text-xs text-emerald-400">
          Open queue →
        </span>
      </Link>
    </div>
  );
}
