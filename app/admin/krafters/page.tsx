import Link from "next/link";

export default function KraftersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Krafters</h1>
        <p className="text-sm text-slate-400">
          Management interface for artisan (Krafter) accounts. More tools will
          land here; document review is available now.
        </p>
      </div>

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

