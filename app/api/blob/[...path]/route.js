"use server";

import { NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

const READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const DEFAULT_ACCESS = process.env.BLOB_DEFAULT_ACCESS || "public";

const FLAGS_URL = process.env.FLAGS_URL || "";

function resolveBlobPath(pathSegments = []) {
  if (!Array.isArray(pathSegments) || pathSegments.length === 0) {
    throw new Error("Missing blob path");
  }
  return pathSegments.join("/");
}

async function fetchBlobContent(pathname) {
  // Prefer explicit FLAGS_URL env if it matches the requested path.
  if (FLAGS_URL) {
    try {
      const url = new URL(FLAGS_URL);
      const envPath = decodeURIComponent(url.pathname.replace(/^\//, ""));
      if (envPath === pathname) {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch blob from FLAGS_URL (status ${res.status})`);
        }
        return { text: await res.text(), source: url.toString(), contentType: res.headers.get("content-type") || undefined };
      }
    } catch (error) {
      console.warn("Invalid FLAGS_URL; falling back to list()", error);
    }
  }

  if (!READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const { blobs } = await list({
    prefix: pathname,
    token: READ_WRITE_TOKEN,
    limit: 1,
  });

  const target = blobs.find((blob) => blob.pathname === pathname) || blobs[0];
  if (!target) {
    return null;
  }

  const downloadUrl = target.downloadUrl || target.url;
  if (!downloadUrl) {
    throw new Error("Blob download URL unavailable");
  }

  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch blob content (status ${res.status})`);
  }

  return {
    text: await res.text(),
    source: downloadUrl,
    contentType: res.headers.get("content-type") || target.contentType,
  };
}

export async function GET(_request, { params }) {
  try {
    const pathname = resolveBlobPath(params.path);
    const blob = await fetchBlobContent(pathname);

    if (!blob) {
      return NextResponse.json({ message: "Blob not found", pathname }, { status: 404 });
    }

    const { text, source, contentType } = blob;


    const baseResponse = {
      pathname,
      source,
      contentType,
    };

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ ...baseResponse, content: parsed });
    } catch {
      return NextResponse.json({ ...baseResponse, content: text });
    }
  } catch (error) {
    console.error("Failed to read blob", error);
    return NextResponse.json({ message: error.message || "Failed to read blob" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const pathname = resolveBlobPath(params.path);
    if (!READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
    }

    const { content, contentType = "application/json", access = DEFAULT_ACCESS } = await request.json();
    if (content === undefined) {
      return NextResponse.json({ message: "content is required" }, { status: 400 });
    }

    const serialized = typeof content === "string" ? content : JSON.stringify(content, null, 2);

    const blob = await put(pathname, serialized, {
      access,
      contentType,
      token: READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      message: "Blob updated",
      pathname: blob.pathname,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      contentType: blob.contentType,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    });
  } catch (error) {
    console.error("Failed to update blob", error);
    return NextResponse.json({ message: error.message || "Failed to update blob" }, { status: 500 });
  }
}
