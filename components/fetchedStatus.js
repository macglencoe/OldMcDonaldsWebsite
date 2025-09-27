"use client";

import { useEffect, useMemo, useState } from "react";

function formatRelativeTime(isoString) {
  if (!isoString) {
    return null;
  }

  const timestamp = new Date(isoString);
  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  const diffMs = Date.now() - timestamp.getTime();
  if (diffMs < 0) {
    return "in the future";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 5) {
    return "just now";
  }

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds === 1 ? "" : "s"} ago`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
}

export default function FetchedStatus({ lastUpdated, fetchedAt }) {
  const [relativeText, setRelativeText] = useState(() => formatRelativeTime(fetchedAt));

  useEffect(() => {
    setRelativeText(formatRelativeTime(fetchedAt));

    if (!fetchedAt) {
      return undefined;
    }

    const interval = setInterval(() => {
      setRelativeText(formatRelativeTime(fetchedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchedAt]);

  const renderText = useMemo(() => {
    const parts = [];
    if (lastUpdated) {
      parts.push(`Last updated: ${lastUpdated}`);
    }
    if (relativeText) {
      parts.push(`Fetched ${relativeText}`);
    }
    return parts.join(" · ");
  }, [lastUpdated, relativeText]);

  if (!renderText) {
    return null;
  }

  return <p className="text-xs text-gray-500">{renderText}</p>;
}
