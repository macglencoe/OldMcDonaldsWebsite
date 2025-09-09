import { PiArrowRightThin } from "react-icons/pi";
import { FiCalendar, FiUser } from "react-icons/fi";
import React from "react";
import type { Update } from "../types/update";

export type LinkLikeProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export type UpdateCardProps = Update & {
  labels?: { viewUpdate?: string };
  markdownRenderer?: (md: string) => React.ReactNode;
  showMeta?: boolean;
  getHref?: (u: Update) => string;
  linkComponent?: React.ComponentType<LinkLikeProps>;
  className?: string;
};

export function UpdateCard({
  id,
  slug,
  title,
  description,
  date,
  author,
  link,
  preview,
  labels,
  markdownRenderer,
  showMeta = true,
  getHref,
  linkComponent: LinkComponent = (p: any) => <a {...p} />,
  className,
}: UpdateCardProps) {
  const key = slug || String(id ?? title);
  const href = getHref ? getHref({ id, slug, title, description, date, author, link, preview }) : (link || "#");
  const body = description || "";

  return (
    <article
      className={`group relative rounded-lg border border-gray-200 bg-white p-4 md:p-5 shadow-sm hover:border-gray-300 transition-colors ${className || ""}`}
      id={`update-${key}`}
    >
      <h3 className="text-base md:text-lg font-semibold tracking-tight text-gray-900 line-clamp-2">{title}</h3>

      {showMeta && (date || author) && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-gray-600">
          {date && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 ring-1 ring-gray-200 px-2 py-0.5">
              <FiCalendar className="h-3.5 w-3.5" /> {date}
            </span>
          )}
          {author && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 ring-1 ring-gray-200 px-2 py-0.5">
              <FiUser className="h-3.5 w-3.5" /> {author}
            </span>
          )}
        </div>
      )}

      {body && (
        <div className="mt-3 text-sm text-gray-700">
          {markdownRenderer ? (
            <div className="prose prose-sm max-w-none line-clamp-4">{markdownRenderer(body)}</div>
          ) : (
            <p className="line-clamp-4">{body}</p>
          )}
        </div>
      )}

      <div className="mt-4">
        <LinkComponent
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-md"
        >
          {labels?.viewUpdate || "View update"}
          <PiArrowRightThin size={20} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
        </LinkComponent>
      </div>
    </article>
  );
}
