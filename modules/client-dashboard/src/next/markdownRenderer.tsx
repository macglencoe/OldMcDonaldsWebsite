import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export function styledMarkdownRenderer(md: string): React.ReactNode {
  return (
    <ReactMarkdown
      // GitHub-flavored markdown for tables, task lists, etc.
      remarkPlugins={[remarkGfm]}
      // Add ids to headings and wrap them with anchor links
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings as any, { behavior: "wrap" }],
      ]}
      components={{
        h1: ({ node, className, ...props }) => (
          <h1 {...props} className={`text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 ${className || ""}`} />
        ),
        h2: ({ node, className, ...props }) => (
          <h2 {...props} className={`mt-8 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 ${className || ""}`} />
        ),
        h3: ({ node, className, ...props }) => (
          <h3 {...props} className={`mt-6 text-xl md:text-2xl font-semibold tracking-tight text-gray-900 ${className || ""}`} />
        ),
        p: ({ node, className, ...props }) => (
          <p {...props} className={`leading-7 text-gray-800 my-5 text-xl ${className || ""}`} />
        ),
        a: ({ node, className, ...props }) => (
          <a
            {...props}
            className={`text-accent hover:underline underline-offset-2 ${className || ""}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        // Style inline code; block code is wrapped by a separate <pre> element by react-markdown
        code: ({ inline, className, children, ...props }) => (
          inline ? (
            <code {...props} className={`px-1.5 py-0.5 rounded bg-gray-100 text-[90%] ${className || ""}`}>
              {children}
            </code>
          ) : (
            <code {...props} className={`${className || ""}`}>{children}</code>
          )
        ),
        // Style the pre container for fenced code blocks
        pre: ({ className, children, ...props }) => (
          <pre {...props} className={`p-3 rounded bg-gray-900 text-gray-100 overflow-x-auto ${className || ""}`}>
            {children}
          </pre>
        ),
        ul: ({ node, className, ...props }) => (
          <ul {...props} className={`list-disc pl-6 my-4 ${className || ""}`} />
        ),
        ol: ({ node, className, ...props }) => (
          <ol {...props} className={`list-decimal pl-6 my-4 ${className || ""}`} />
        ),
        li: ({ node, className, ...props }) => (
          <li {...props} className={`my-1 ${className || ""}`} />
        ),
        blockquote: ({ node, className, ...props }) => (
          <blockquote
            {...props}
            className={`border-l-4 border-gray-300 pl-4 italic text-gray-700 ${className || ""}`}
          />
        ),
        img: ({ node, className, ...props }) => (
          <img {...props} className={`rounded-md shadow-sm my-10 ${className || ""}`} />
        ),
        hr: ({ node, className, ...props }) => (
          <hr {...props} className={`my-8 border-gray-200 ${className || ""}`} />
        ),
        // Tables (GFM)
        table: ({ node, className, children, ...props }) => (
          <div className="my-6 w-full overflow-x-auto">
            <table
              {...props}
              className={`w-full border-collapse text-sm ${className || ""}`}
            >
              {children}
            </table>
          </div>
        ),
        thead: ({ node, className, ...props }) => (
          <thead {...props} className={`bg-gray-50 ${className || ""}`} />
        ),
        tr: ({ node, className, ...props }) => (
          <tr {...props} className={`border-b border-gray-200 even:bg-gray-50 ${className || ""}`} />
        ),
        th: ({ node, className, ...props }) => (
          <th
            {...props}
            className={`text-left font-semibold px-3 py-2 align-middle text-gray-900 border-b border-gray-200 ${className || ""}`}
          />
        ),
        td: ({ node, className, ...props }) => (
          <td
            {...props}
            className={`px-3 py-2 align-top text-gray-800 border-b border-gray-100 ${className || ""}`}
          />
        ),
      }}
    >
      {md}
    </ReactMarkdown>
  );
}
