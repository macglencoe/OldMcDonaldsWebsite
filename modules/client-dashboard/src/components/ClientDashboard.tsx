import React from "react";
import type { Update } from "../types/update";
import { UpdateCard } from "./UpdateCard";

export type ClientDashboardProps = {
  updates: Update[];
  className?: string;
  variant?: "grid" | "compact";
  maxItems?: number;
  renderHeader?: (ctx: { total: number; lastUpdated?: string }) => React.ReactNode;
  renderCard?: (u: Update) => React.ReactNode;
  emptyState?: React.ReactNode;
  getUpdateHref?: (u: Update) => string;
  markdownRenderer?: (md: string) => React.ReactNode;
  labels?: { viewUpdate?: string; lastUpdated?: string; noUpdates?: string };
  formatDate?: (iso: string) => string;
  showMeta?: boolean;
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
};

export function ClientDashboard({
  updates,
  className,
  variant = "grid",
  maxItems,
  renderHeader,
  renderCard,
  emptyState,
  getUpdateHref,
  markdownRenderer,
  labels,
  formatDate,
  showMeta = true,
  linkComponent,
}: ClientDashboardProps) {
  const list = typeof maxItems === "number" ? updates.slice(0, Math.max(0, maxItems)) : updates;
  const lastUpdatedRaw = list.find((u) => u.date)?.date || updates.find((u) => u.date)?.date;
  const lastUpdated = lastUpdatedRaw && (formatDate ? formatDate(lastUpdatedRaw) : lastUpdatedRaw);

  return (
    <section className={`w-full ${className || ""}`}>
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium tracking-wide text-gray-500 uppercase">Client Dashboard</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Project Updates</h2>
            <p className="mt-1 text-sm text-gray-600">Latest progress, design notes, and release changes.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {lastUpdated && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 text-gray-700 ring-1 ring-gray-200 px-3 py-1">
                <span>{labels?.lastUpdated || "Last updated"} {lastUpdated}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 text-gray-700 ring-1 ring-gray-200 px-3 py-1">
              <span className="font-semibold">{updates.length}</span> updates
            </div>
          </div>
        </div>

        {renderHeader?.({ total: updates.length, lastUpdated })}

        {list.length > 0 ? (
          <div className={variant === "grid" ? "mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" : "mt-6 space-y-4"}>
            {list.map((u) => (
              renderCard ? (
                <React.Fragment key={u.slug || String(u.id ?? u.title)}>{renderCard(u)}</React.Fragment>
              ) : (
                <UpdateCard
                  key={u.slug || String(u.id ?? u.title)}
                  {...u}
                  getHref={getUpdateHref}
                  markdownRenderer={markdownRenderer}
                  labels={{ viewUpdate: labels?.viewUpdate }}
                  showMeta={showMeta}
                  linkComponent={linkComponent as any}
                />
              )
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center text-center text-gray-600">
            {emptyState || (
              <>
                <div className="h-10 w-10 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center mb-3">
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
                <p className="font-medium text-gray-800">{labels?.noUpdates || "No updates yet"}</p>
                <p className="text-sm">When updates are added to the content folder, they’ll appear here.</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

