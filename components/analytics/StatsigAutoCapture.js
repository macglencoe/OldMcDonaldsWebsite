"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Statsig from "statsig-js";

const CLIENT_KEY = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY;

let initPromise = null;

function getStableIdFromCookie() {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    ?.split(";")
    ?.map((part) => part.trim())
    ?.find((part) => part.startsWith("statsig-stable-id="));
  if (!match) return undefined;
  try {
    return decodeURIComponent(match.split("=", 2)[1] ?? "");
  } catch {
    return match.split("=", 2)[1] ?? undefined;
  }
}

async function ensureStatsigInitialized() {
  if (!CLIENT_KEY) return null;
  if (!initPromise) {
    const stableID = getStableIdFromCookie();
    const user = stableID ? { userID: stableID } : {};
    initPromise = Statsig.initialize(CLIENT_KEY, user, {
      disableCurrentPageLogging: true,
      disableInitialExposureLogging: true,
    }).catch((error) => {
      console.warn("Statsig initialization failed", error);
      initPromise = null;
      return null;
    });
  }
  return initPromise;
}

function safeSerializeError(error) {
  if (!error) return { message: "Unknown error" };
  if (typeof error === "string") return { message: error };
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }
  try {
    return {
      message: JSON.stringify(error),
    };
  } catch {
    return { message: "Unserializable error" };
  }
}

function logAutoCapture(eventName, metadata) {
  ensureStatsigInitialized()?.then(() => {
    try {
      Statsig.logEvent(eventName, null, metadata);
    } catch (error) {
      console.warn(`Statsig logEvent failed for ${eventName}`, error);
    }
  });
}

function buildClickMetadata(event) {
  if (!event?.target || !(event.target instanceof Element)) {
    return { target: "unknown" };
  }
  const element = event.target.closest("[data-analytics-id], button, a, input, [role=button]");
  const metadata = {
    path: window.location?.pathname ?? "",
    tag: element?.tagName ?? event.target.tagName,
    id: element?.id ?? "",
    dataset: element?.dataset ? { ...element.dataset } : undefined,
    text: element?.innerText?.slice(0, 120) ?? undefined,
    href: element instanceof HTMLAnchorElement ? element.href : undefined,
  };
  return metadata;
}

function buildPageViewMetadata(pathname, searchParams) {
  const search = searchParams?.toString();
  return {
    path: pathname,
    search: search ? `?${search}` : "",
    title: typeof document !== "undefined" ? document.title : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
  };
}

export default function StatsigAutoCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_KEY) {
      return;
    }

    ensureStatsigInitialized();

    const handleClick = (event) => {
      logAutoCapture("auto_capture::click", buildClickMetadata(event));
    };
    const handleError = (event) => {
      const metadata = {
        type: "error",
        message: event?.message,
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno,
        ...safeSerializeError(event?.error),
      };
      logAutoCapture("auto_capture::error", metadata);
    };
    const handleRejection = (event) => {
      const metadata = {
        type: "unhandledrejection",
        reason: safeSerializeError(event?.reason),
      };
      logAutoCapture("auto_capture::error", metadata);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  useEffect(() => {
    if (!CLIENT_KEY) return;
    const currentPath = `${pathname}${searchParams?.toString() ? `?${searchParams}` : ""}`;
    if (currentPath === lastPathRef.current) return;
    lastPathRef.current = currentPath;
    logAutoCapture("auto_capture::page_view", buildPageViewMetadata(pathname, searchParams));
  }, [pathname, searchParams]);

  return null;
}
