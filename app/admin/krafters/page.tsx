import { Suspense } from "react";
import KraftersPageContent from "./krafters-content";

function KraftersFallback() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Krafters</h1>
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  );
}

export default function KraftersPage() {
  return (
    <Suspense fallback={<KraftersFallback />}>
      <KraftersPageContent />
    </Suspense>
  );
}
