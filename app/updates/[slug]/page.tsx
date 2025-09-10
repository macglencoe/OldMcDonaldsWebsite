import React from "react";
import { createUpdateDetailPage, createGenerateStaticParams, FsContent, styledMarkdownRenderer } from "../../../modules/client-dashboard";
import Layout from '../../../components/layout'

const adapter = {
  list: () => FsContent.list({ contentDir: "content" }),
  listSlugs: () => FsContent.listSlugs({ contentDir: "content" }),
  getBySlug: (slug: string) => FsContent.getBySlug(slug, { contentDir: "content" }),
};

const Body = createUpdateDetailPage(adapter, {
  markdownRenderer: styledMarkdownRenderer,
  backHref: "/",
});

const Page = (props: { params: { slug: string } }) => {
  return (
    <Layout>
      <Body {...props} />
    </Layout>
  );
};

export default Page;
export const generateStaticParams = createGenerateStaticParams(adapter);
