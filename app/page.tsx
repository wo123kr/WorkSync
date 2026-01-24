import { Suspense } from "react";
import WorkSync from "@/components/WorkSync";

function WorkSyncLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-12 bg-secondary rounded-lg" />
      <div className="h-48 bg-secondary rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="h-32 bg-secondary rounded-lg" />
        <div className="h-32 bg-secondary rounded-lg" />
        <div className="h-32 bg-secondary rounded-lg" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<WorkSyncLoading />}>
          <WorkSync />
        </Suspense>
      </div>
    </main>
  );
}
