import { notFound } from "next/navigation";
import type { Update } from "../types/update";
import React from "react";
import { SiVercel } from "react-icons/si";

export type ContentAdapter = {
  list: () => Promise<Update[]>;
  listSlugs: () => Promise<string[]>;
  getBySlug: (slug: string) => Promise<{ update: Update; content: string } | null>;
};

export type DashboardConfig = {
  basePath?: string; // e.g. "/updates"
  markdownRenderer?: (md: string) => React.ReactNode;
  formatDate?: (iso: string) => string;
  labels?: { viewUpdate?: string; lastUpdated?: string; noUpdates?: string };
  showMeta?: boolean;
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
  backHref?: string; // default: "/"
  showPreviewCTA?: boolean; // default: true
};

export function createUpdatesIndexPage(adapter: ContentAdapter, cfg?: DashboardConfig) {
  const { markdownRenderer, labels, formatDate, showMeta, linkComponent, basePath = "/updates" } = cfg || {};
  const ClientDashboard = require("../components/ClientDashboard").ClientDashboard as React.FC<any>;
  return async function UpdatesIndex() {
    const updates = await adapter.list();
    return (
      <div className="max-w-5xl mx-auto min-h-screen flex flex-col items-stretch justify-start bg-gray-50 px-3 py-10">
        <ClientDashboard
          updates={updates.map((u) => ({ ...u, link: u.link || `${basePath}/${u.slug}` }))}
          variant="grid"
          markdownRenderer={markdownRenderer}
          labels={labels}
          formatDate={formatDate}
          showMeta={showMeta}
          linkComponent={linkComponent}
        />
      </div>
    );
  };
}

export function createUpdateDetailPage(adapter: ContentAdapter, cfg?: DashboardConfig) {
  const { markdownRenderer, backHref = "/", showPreviewCTA = true } = cfg || {};
  return async function UpdateDetail({ params }: { params: { slug: string } }) {
    const res = await adapter.getBySlug(params.slug);
    if (!res) notFound();
    const { update, content } = res;
    return (
      <article className="prose mx-auto p-4 max-w-5xl shadow-2xl min-h-screen">
        <div className="flex flex-col md:flex-row flex-wrap border-b border-black/20">
          <div className="mb-5 py-2 flex-1">
            <div className="mb-4">
              <a href={backHref} className="text-sm text-blue-600 hover:underline">← Back to Dashboard</a>
            </div>
            <h1 className="flex flex-col">
              <span className="text-lg font-bold">Development Updates</span>
              <span className="text-3xl">{update.title}</span>
            </h1>
            {(update.date || update.author) && (
              <p className="text-sm text-gray-600">{update.date}{update.date && update.author ? " • " : ""}{update.author}</p>
            )}
          </div>
          {showPreviewCTA && update.preview && (
            <div className="flex flex-col items-center justify-center flex-1">
              <a href={update.preview} target="_blank" className="w-fit my-10 mx-auto bg-black text-white px-4 py-2 rounded-xl">
                <SiVercel color="white" className="inline mr-3" />
                See Preview
              </a>
            </div>
          )}
        </div>
        <div className="mt-6">
          {markdownRenderer ? markdownRenderer(content) : <div>{content}</div>}
        </div>
      </article>
    );
  };
}

export function createGenerateStaticParams(adapter: ContentAdapter) {
  return async function generateStaticParams(): Promise<{ slug: string }[]> {
    const slugs = await adapter.listSlugs();
    return slugs.map((slug) => ({ slug }));
  };
}

