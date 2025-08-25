import { Suspense } from "react";
import SearchClient from "./SearchClient";
import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";

export const metadata = {
  title: "Search",
  description: "Find content across the site.",
};

export default function Page() {
  return (
    <Layout>
        <PageHeader>Search</PageHeader>
        <div className="mx-auto max-w-5xl px-4 py-10">
    
          {/* Suspense fixes the "useSearchParams should be wrapped…" warning */}
          <Suspense
            fallback={
              <div className="h-24 animate-pulse rounded-xl bg-foreground/5" />
            }
          >
            <SearchClient />
          </Suspense>
        </div>
    </Layout>
  );
}
