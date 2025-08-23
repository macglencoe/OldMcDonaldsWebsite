import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search",
  description: "Find content across the site.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Search</h1>

      {/* Suspense fixes the "useSearchParams should be wrapped…" warning */}
      <Suspense
        fallback={
          <div className="h-24 animate-pulse rounded-xl bg-foreground/5" />
        }
      >
        <SearchClient />
      </Suspense>
    </div>
  );
}
