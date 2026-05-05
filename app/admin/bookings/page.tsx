"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { canTriggerBookingExpireOverdueSweep } from "@/lib/permissions";
import { useAuth } from "@/hooks/useAuth";
import { bookingsAdminService } from "@/services/bookings-admin.service";
import type { ExpireOverdueSweepResult } from "@/types/bookings-admin";

function SummaryCard({ result }: { result: ExpireOverdueSweepResult }) {
  const rows: { label: string; value: string }[] = [
    { label: "Scanned", value: String(result.scanned) },
    { label: "Expired", value: String(result.expired) },
    { label: "Cutoff (ISO)", value: result.cutoffIso },
    { label: "Grace hours", value: String(result.graceHours) },
    { label: "Batch size", value: String(result.batchSize) }
  ];
  return (
    <div className="mt-4 max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Last run result
      </h3>
      <dl className="space-y-2 text-xs">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-slate-800/80 py-1.5 last:border-0"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-mono text-right text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function BookingsPage() {
  const { user } = useAuth();
  const canRunSweep = canTriggerBookingExpireOverdueSweep(user);
  const [lastResult, setLastResult] = useState<ExpireOverdueSweepResult | null>(
    null
  );

  const expireMutation = useMutation({
    mutationFn: () => bookingsAdminService.runExpireOverdueSweep(),
    onSuccess: (data) => {
      setLastResult(data);
    }
  });

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">Bookings</h1>
      <p className="text-sm text-slate-400">
        Overview and management of bookings between Krafters and customers.
      </p>

      <section className="mt-6 max-w-lg rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-medium text-slate-100">
          Expire overdue bookings
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Runs the same logic as the scheduled expiry sweep immediately (marks
          overdue bookings as expired using the configured cutoff, grace, and
          batch size).
        </p>

        {canRunSweep ? (
          <>
            <button
              type="button"
              onClick={() => expireMutation.mutate()}
              disabled={expireMutation.isPending}
              className="mt-4 rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-100 hover:bg-amber-500/20 disabled:opacity-50"
            >
              {expireMutation.isPending ? "Running sweep…" : "Run expiry sweep now"}
            </button>
            {expireMutation.isError && (
              <p className="mt-3 text-xs text-rose-300">
                {expireMutation.error instanceof Error
                  ? expireMutation.error.message
                  : "Request failed"}
              </p>
            )}
            {lastResult && <SummaryCard result={lastResult} />}
          </>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Only users with the Admin or Super Admin role can trigger this
            action.
          </p>
        )}
      </section>
    </div>
  );
}
