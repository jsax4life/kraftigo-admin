"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { WorkEligibilitySubmission } from "@/types/work-eligibility";
import { getKrafterLabel } from "@/lib/work-eligibility-display";

function statusBadge(status: WorkEligibilitySubmission["status"]) {
  const styles: Record<
    WorkEligibilitySubmission["status"],
    string
  > = {
    PENDING:
      "border-amber-500/40 bg-amber-500/10 text-amber-200",
    APPROVED:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    REJECTED:
      "border-rose-500/40 bg-rose-500/10 text-rose-200"
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export const workEligibilityColumns: ColumnDef<WorkEligibilitySubmission>[] =
  [
    {
      id: "krafter",
      header: "Krafter",
      cell: ({ row }) => (
        <span className="font-medium text-slate-50">
          {getKrafterLabel(row.original)}
        </span>
      )
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-slate-400">
          {row.original.userId ?? "—"}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.status)
    },
    {
      id: "submitted",
      header: "Submitted",
      cell: ({ row }) => {
        const raw = row.original.createdAt ?? row.original.updatedAt;
        if (!raw) return <span className="text-slate-500">—</span>;
        return (
          <span>
            {new Date(raw).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short"
            })}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Link
          href={`/admin/work-eligibility/${row.original.id}`}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Open
        </Link>
      )
    }
  ];
