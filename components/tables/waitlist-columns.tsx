"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { WaitlistEntry } from "@/types/waitlist";

export const waitlistColumns: ColumnDef<WaitlistEntry>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-slate-50">
        {row.original.fullName}
      </span>
    )
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => (
      <span>
        {row.original.city}, {row.original.country}
      </span>
    )
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const label =
        role === "ARTISAN"
          ? "Krafter"
          : role === "CUSTOMER"
          ? "Customer"
          : "Both";
      return (
        <span className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
          {label}
        </span>
      );
    }
  },
  {
    accessorKey: "serviceInterest",
    header: "Service Interest"
  },
  {
    id: "contact",
    header: "Contact OK",
    cell: ({ row }) =>
      row.original.agreesToContact ? (
        <span className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
          Agreed
        </span>
      ) : (
        <span className="inline-flex rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-200">
          Do not contact
        </span>
      )
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      })
  }
];

