"use client"
import { useState } from "react";
import features from '@/config/features.json'

export default function FeatureBoard() {

  const [visibleCount, setVisibleCount] = useState(3);

  const visibleFeatures = features.slice(0, visibleCount);
  const hasMore = visibleCount < features.length;
  const showMore = () =>
    setVisibleCount((c) => Math.min(c + 3, features.length));

  return (
    <aside className="w-full max-w-sm">
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">In-progress features</h3>
        </div>

        <div className="flex flex-col gap-2">
          {visibleFeatures.map((f, idx) => (
            <FeatureCard key={`${f.title}-${idx}`} {...f} />
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={showMore}
              aria-label="Show 3 more features"
              className="w-min self-center px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              ...
            </button>
          )}
          {visibleFeatures.length == 0 && (
            <p className="text-gray-600 px-3 py-1 self-center">No new features are in progress right now</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function FeatureCard({ title, prUrl, description, preview }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white/50 p-3 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {description && (
            <p className="mt-0.5 text-xs text-gray-600">{description}</p>
          )}
        </div>
        <div className="flex flex-col justify-around items-end gap-2">
            {prUrl && (
              <a
                href={prUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs p-2 bg-[#4078c0] text-white hover:bg-[#4078c0]/70 whitespace-nowrap rounded-xl"
              >
                View PR
              </a>
            )}
            {preview && (
                <a href={preview}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs p-2 bg-black text-white hover:bg-black/50 whitespace-nowrap rounded-xl">
                    Preview
                </a>
            )}
        </div>
      </div>
    </div>
  );
}
