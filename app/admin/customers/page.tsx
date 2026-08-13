"use client";

import { DataTable } from "@/components/tables/data-table";
import { adminUserColumns } from "@/components/tables/admin-user-columns";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";

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

export default function CustomersPage() {
  const { data, isLoading, isError, error } = useAdminCustomers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Customers</h1>
        <p className="text-sm text-slate-400">
          Customer accounts from{" "}
          <code className="text-[11px]">/api/admin/users/customers</code> with
          profiles from{" "}
          <code className="text-[11px]">/api/admin/profiles/customers</code>.
        </p>
      </div>

      {isLoading && <TableSkeleton />}
      {isError && (
        <p className="text-xs text-rose-300">
          Failed to load customers: {error?.message ?? "Unknown error"}
        </p>
      )}
      {!isLoading && !isError && (
        <>
          {!data?.length ? (
            <p className="text-xs text-slate-400">No customers found.</p>
          ) : (
            <DataTable columns={adminUserColumns} data={data} />
          )}
        </>
      )}
    </div>
  );
}
