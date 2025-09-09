import React from "react";
import ReactMarkdown from "react-markdown";
import { createUpdateDetailPage, createGenerateStaticParams, FsContent } from "../../../modules/client-dashboard";

const adapter = {
  list: () => FsContent.list({ contentDir: "content" }),
  listSlugs: () => FsContent.listSlugs({ contentDir: "content" }),
  getBySlug: (slug: string) => FsContent.getBySlug(slug, { contentDir: "content" }),
};

const Page = createUpdateDetailPage(adapter, {
  markdownRenderer: (md) => <ReactMarkdown>{md}</ReactMarkdown>,
  backHref: "/",
});

export default Page;
export const generateStaticParams = createGenerateStaticParams(adapter);
