"use client";

import { useMemo, useState } from "react";

function encodePath(path) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normalizeForDiff(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(normalizeForDiff);
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = normalizeForDiff(value[key]);
      return acc;
    }, {});
}

function stableStringify(input) {
  try {
    return JSON.stringify(normalizeForDiff(input), null, 2);
  } catch (error) {
    console.warn("Failed to stringify content for diffing", error);
    return typeof input === "string" ? input : "";
  }
}

function makeUnifiedDiff(oldStr, newStr) {
  const a = oldStr.split(/\r?\n/);
  const b = newStr.split(/\r?\n/);
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out = [];
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push(` ${a[i]}`);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push(`-${a[i]}`);
      i += 1;
    } else {
      out.push(`+${b[j]}`);
      j += 1;
    }
  }

  while (i < n) {
    out.push(`-${a[i]}`);
    i += 1;
  }
  while (j < m) {
    out.push(`+${b[j]}`);
    j += 1;
  }

  return out.join("\n");
}

async function fetchCurrentBlob(filePath) {
  const encodedPath = encodePath(filePath);
  const res = await fetch(`/api/blob/${encodedPath}`);
  if (res.status === 404) {
    return "";
  }
  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `Failed to read current blob (${res.status} ${res.statusText}): ${message}`,
    );
  }

  const payload = await res.json();
  if (payload?.content && typeof payload.content === "object") {
    return JSON.stringify(payload.content, null, 2);
  }

  return typeof payload?.content === "string"
    ? payload.content
    : JSON.stringify(payload ?? {}, null, 2);
}

async function putBlob(filePath, content, options = {}) {
  const encodedPath = encodePath(filePath);
  const res = await fetch(`/api/blob/${encodedPath}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      contentType: options.contentType ?? "application/json",
      access: options.access,
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMessage =
      payload?.message ||
      payload?.error ||
      `${res.status} ${res.statusText}`.trim();
    throw new Error(errorMessage);
  }
  return payload;
}

export default function CommitPanel({ content, filePath, title = "Publish" }) {
  const [responseConsole, setResponseConsole] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [diff, setDiff] = useState("");
  const [currentSnapshot, setCurrentSnapshot] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const newSnapshot = useMemo(() => stableStringify(content), [content]);

  const prepareDiff = async () => {
    setErrorMessage(null);
    setIsSaving(true);
    try {
      const current = await fetchCurrentBlob(filePath);
      setCurrentSnapshot(current);
      setDiff(makeUnifiedDiff(current, newSnapshot));
      setShowConfirm(true);
    } catch (error) {
      console.error("Failed to prepare diff", error);
      setErrorMessage(error.message || "Failed to prepare diff");
    } finally {
      setIsSaving(false);
    }
  };

  const publishChanges = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const startedAt = new Date().toLocaleString();
    setResponseConsole((entries) => [
      ...entries,
      {
        time: startedAt,
        statusText: "Uploading to blob...",
        ok: true,
        filePath,
      },
    ]);

    try {
      const result = await putBlob(filePath, newSnapshot);
      const finishedAt = new Date().toLocaleString();

      setResponseConsole((entries) => [
        ...entries.slice(0, -1),
        {
          time: finishedAt,
          status: 200,
          statusText: "Blob updated successfully",
          ok: true,
          filePath,
          result,
        },
      ]);
    } catch (error) {
      const finishedAt = new Date().toLocaleString();
      setResponseConsole((entries) => [
        ...entries.slice(0, -1),
        {
          time: finishedAt,
          statusText: "Upload failed",
          ok: false,
          filePath,
          error: error.message || error,
        },
      ]);
      setErrorMessage(error.message || "Failed to update blob");
    } finally {
      setIsSaving(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="m-3 p-3 rounded-2xl border border-foreground/20">
      <div className="row">
        <button
          disabled={isSaving}
          onClick={prepareDiff}
          className="btn btn-primary"
        >
          Review &amp; Publish
        </button>
        <button
          disabled={isSaving}
          onClick={publishChanges}
          className="btn btn-success"
        >
          Publish Without Review
        </button>
      </div>

      {errorMessage && (
        <div className="card mt-3 border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card max-h-[80vh] w-[90%] max-w-4xl overflow-auto shadow-xl">
            <div className="card-header">Confirm Publish</div>
            <div className="card-body space-y-4">
              <section>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-foreground/60">
                  Review the proposed changes below. Confirm to publish to blob
                  storage.
                </p>
              </section>
              <section className="grid gap-4 md:grid-cols-2">
                <div className="card">
                  <div className="px-3 py-2 font-semibold">Current</div>
                  <pre className="code max-h-[40vh] overflow-auto">
{currentSnapshot}
                  </pre>
                </div>
                <div className="card">
                  <div className="px-3 py-2 font-semibold">Proposed</div>
                  <pre className="code max-h-[40vh] overflow-auto">
{newSnapshot}
                  </pre>
                </div>
              </section>
              <section className="card">
                <div className="px-3 py-2 font-semibold">Diff</div>
                <pre className="code diff max-h-[40vh] overflow-auto">
{diff}
                </pre>
              </section>
              <div className="row justify-end">
                <button
                  className="btn"
                  onClick={() => {
                    setShowConfirm(false);
                    setDiff("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isSaving}
                  onClick={publishChanges}
                >
                  Confirm Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {responseConsole.length > 0 && (
        <div className="mt-3 stack">
          <ul className="stack">
            {responseConsole.map((response, index) => (
              <li key={index} className="card">
                <div className="card-body flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h1>
                    {response.filePath ? `[${response.filePath}] ` : ""}
                    {response.statusText ?? "Status unknown"}
                  </h1>
                  <p className="text-sm text-foreground/60">
                    {response.time ?? "Unknown time"}
                  </p>
                </div>
                <div className="card-body space-y-2">
                  {response.error && (
                    <pre className="code text-red-500">
{String(response.error)}
                    </pre>
                  )}
                  {response.result && (
                    <details>
                      <summary>Blob response</summary>
                      <pre className="code">
{JSON.stringify(response.result, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
