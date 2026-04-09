"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWorkEligibilityDocument } from "@/hooks/useWorkEligibilityDocument";
import { workEligibilityService } from "@/services/work-eligibility.service";
import {
  getDocumentHref,
  getKrafterLabel
} from "@/lib/work-eligibility-display";
import type { WorkEligibilitySubmission } from "@/types/work-eligibility";

const REJECTION_MAX = 2000;

function SummaryRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 border-b border-slate-900 py-2 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-xs text-slate-100">{children}</dd>
    </div>
  );
}

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

export default function WorkEligibilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : undefined;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useWorkEligibilityDocument(id);

  const [rejectReason, setRejectReason] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    setShowRejectForm(false);
    setRejectReason("");
    setLocalError(null);
  }, [id]);

  const reviewMutation = useMutation({
    mutationFn: ({
      id: docId,
      body
    }: {
      id: string;
      body: Parameters<typeof workEligibilityService.review>[1];
    }) => workEligibilityService.review(docId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["work-eligibility"] });
      router.push("/admin/work-eligibility");
    },
    onError: (e: Error) => {
      setLocalError(e.message);
    }
  });

  function handleApprove() {
    if (!id) return;
    setShowRejectForm(false);
    setLocalError(null);
    reviewMutation.mutate({ id, body: { status: "APPROVED" } });
  }

  function cancelReject() {
    setShowRejectForm(false);
    setRejectReason("");
    setLocalError(null);
  }

  function handleReject() {
    if (!id) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setLocalError("Rejection reason is required.");
      return;
    }
    if (trimmed.length > REJECTION_MAX) {
      setLocalError(`Reason must be at most ${REJECTION_MAX} characters.`);
      return;
    }
    setLocalError(null);
    reviewMutation.mutate({
      id,
      body: { status: "REJECTED", rejectionReason: trimmed }
    });
  }

  const docHref = data ? getDocumentHref(data) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Work eligibility review</h1>
          <p className="font-mono text-[11px] text-slate-500">{id}</p>
        </div>
        <Link
          href="/admin/work-eligibility"
          className="text-xs text-emerald-400 hover:text-emerald-300"
        >
          ← All submissions
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-800/80" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-800/80" />
        </div>
      )}

      {isError && (
        <p className="text-xs text-rose-300">
          {error?.message || "Could not load this document."}
        </p>
      )}

      {data && (
        <>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Summary
            </h2>
            <dl>
              <SummaryRow label="Krafter">{getKrafterLabel(data)}</SummaryRow>
              <SummaryRow label="User ID">
                <span className="font-mono text-[11px]">
                  {data.userId ?? "—"}
                </span>
              </SummaryRow>
              <SummaryRow label="Status">{statusBadge(data.status)}</SummaryRow>
              {data.rejectionReason && (
                <SummaryRow label="Rejection reason">
                  <span className="whitespace-pre-wrap text-rose-200/90">
                    {data.rejectionReason}
                  </span>
                </SummaryRow>
              )}
              <SummaryRow label="Document">
                {docHref ? (
                  <a
                    href={docHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline hover:text-emerald-300"
                  >
                    Open file
                  </a>
                ) : (
                  <span className="text-slate-500">
                    No URL in payload — see raw details below
                  </span>
                )}
              </SummaryRow>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Serialized payload
            </h2>
            <pre className="max-h-80 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-300">
              {JSON.stringify(data, null, 2)}
            </pre>
          </section>

          {data.status === "PENDING" && (
            <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Decision
              </h2>
              {(localError || reviewMutation.isError) && (
                <p className="text-xs text-rose-300">
                  {localError ||
                    (reviewMutation.error instanceof Error
                      ? reviewMutation.error.message
                      : "Request failed")}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={reviewMutation.isPending}
                  className="rounded-full border border-emerald-500/50 bg-emerald-500/15 px-4 py-2 text-xs font-medium text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  Approve
                </button>
                {!showRejectForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(true);
                      setLocalError(null);
                    }}
                    disabled={reviewMutation.isPending}
                    className="rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:border-rose-500/40 hover:text-rose-200 disabled:opacity-50"
                  >
                    Reject…
                  </button>
                )}
              </div>
              {showRejectForm && (
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <label className="block text-[10px] uppercase tracking-wide text-slate-500">
                    Rejection reason (required, max {REJECTION_MAX} chars)
                  </label>
                  <textarea
                    className="min-h-[100px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-rose-400"
                    placeholder="Explain why this document is rejected…"
                    value={rejectReason}
                    maxLength={REJECTION_MAX}
                    onChange={(e) => setRejectReason(e.target.value)}
                    aria-label="Rejection reason"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">
                      {rejectReason.length} / {REJECTION_MAX}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={cancelReject}
                        disabled={reviewMutation.isPending}
                        className="rounded-full border border-slate-600 bg-slate-950 px-3 py-2 text-xs text-slate-300 hover:border-slate-500 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={reviewMutation.isPending}
                        className="rounded-full border border-rose-500/50 bg-rose-500/15 px-4 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/25 disabled:opacity-50"
                      >
                        Confirm rejection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {data.status !== "PENDING" && (
            <p className="text-xs text-slate-500">
              This submission was already {data.status.toLowerCase()}. No
              further review actions are available.
            </p>
          )}
        </>
      )}
    </div>
  );
}
