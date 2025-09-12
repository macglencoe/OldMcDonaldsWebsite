"use client";
import { useState } from "react";

export default function CommitPanel({ content, filePath, title = "Commit" }) {
  const [responseConsole, setResponseConsole] = useState([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(null); // { branches, message }
  const [diffs, setDiffs] = useState([]); // [{ branch, diffText }]

  const stableStringify = (obj) => {
    const normalize = (v) => {
      if (v === null || typeof v !== 'object') return v;
      if (Array.isArray(v)) return v.map(normalize);
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => {
          acc[k] = normalize(v[k]);
          return acc;
        }, {});
    };
    return JSON.stringify(normalize(obj), null, 2);
  };

  // LCS-based unified diff (line granularity)
  const makeUnifiedDiff = (oldStr, newStr) => {
    const a = oldStr.split(/\r?\n/);
    const b = newStr.split(/\r?\n/);
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const out = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        out.push(` ${a[i]}`);
        i++; j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        out.push(`-${a[i]}`);
        i++;
      } else {
        out.push(`+${b[j]}`);
        j++;
      }
    }
    while (i < n) out.push(`-${a[i++]}`);
    while (j < m) out.push(`+${b[j++]}`);
    return out.join("\n");
  };

  const fetchCurrentFromBranch = async (branch) => {
    try {
      const encodedPath = encodeURIComponent(filePath);
      const url = `/api/files/${encodedPath}?sha=${encodeURIComponent(branch)}`;
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (typeof json === 'object' && json !== null) {
          return JSON.stringify(json, null, 2);
        }
      } catch {}
      return text;
    } catch (e) {
      return '';
    }
  };

  const prepareCommit = async (branches, message) => {
    const newText = stableStringify(content);
    const branchDiffs = [];
    for (const b of branches) {
      const currentText = await fetchCurrentFromBranch(b);
      const diffText = makeUnifiedDiff(currentText, newText);
      branchDiffs.push({ branch: b, diffText });
    }
    setDiffs(branchDiffs);
    setPending({ branches, message });
    setShowConfirm(true);
  };

  const commitToGithub = async (branches, message) => {
    setIsCommitting(true);
    try {
      const encodedPath = encodeURIComponent(filePath);
      const url = `/api/files/${encodedPath}`;

      for (const branch of branches) {
        setResponseConsole((c) => [
          ...c,
          {
            time: new Date().toISOString(),
            status: "standby",
            statusText: `Committing to ${branch}...`,
            ok: true,
          },
        ]);

        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch,
            message,
            content: JSON.stringify(content, null, 2),
          }),
        });

        const payload = await response.json().catch(() => ({}));

        setResponseConsole((c) => c.slice(0, -1));
        setResponseConsole((c) => [
          ...c,
          {
            time: new Date().toLocaleString(),
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            branch,
            ...(response.ok
              ? { message: payload.message, commitData: payload.result }
              : { error: payload.error || payload }),
          },
        ]);
      }
    } catch (err) {
      setResponseConsole((c) => [
        ...c,
        {
          time: new Date().toLocaleString(),
          statusText: "error",
          ok: false,
          message: err.message,
        },
      ]);
    } finally {
      setIsCommitting(false);
    }
  };

  const defaultMessage = `${title}: ${new Date().toLocaleString()}`;

  return (
    <div className="m-3 p-3 rounded-2xl border border-foreground/20">
      <div className="row">
        <button disabled={isCommitting} onClick={() => prepareCommit(["cms", "main"], defaultMessage)} className="btn btn-primary">
          Commit to CMS + Main
        </button>
        <button disabled={isCommitting} onClick={() => prepareCommit(["testing"], defaultMessage)} className="btn btn-success">
          Commit to Testing
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-4xl w-[90%] max-h-[80vh] overflow-auto shadow-xl">
            <div className="card-header">Confirm Commit</div>
            <div className="card-body">
              <h2 className="text-xl font-bold mb-2">Confirm Commit</h2>
              <p className="mb-3">Review changes below, then confirm to commit.</p>
              <div className="space-y-4">
                {diffs.map(({ branch, diffText }, idx) => (
                  <div key={idx} className="card">
                    <div className="px-3 py-2 bg-foreground/10 font-bold rounded-t-lg">Branch: {branch}</div>
                    <pre className="code diff">
{diffText}
                    </pre>
                  </div>
                ))}
              </div>
              <div className="mt-4 row justify-end">
                <button onClick={() => { setShowConfirm(false); setPending(null); setDiffs([]); }} className="btn">Cancel</button>
                <button disabled={isCommitting} onClick={async () => {
                  if (!pending) return;
                  setShowConfirm(false);
                  await commitToGithub(pending.branches, pending.message);
                  setPending(null);
                  setDiffs([]);
                }} className="btn btn-primary">Confirm Commit</button>
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
                <div className="card-body flex flex-row justify-between gap-4">
                  <h1>
                    {response.branch ? `[${response.branch}] ` : ""}
                    {response.status ? response.status + ": " : ""}
                    {response.statusText ?? "Unknown"}
                  </h1>
                  <p>{response.time ?? "Unknown"}</p>
                </div>
                <div className="card-body">
                <pre className="code">{response.message ?? "No message"}</pre>
                {response.status === 200 && (
                  <div className="vercel-deployments mt-2">
                    <b>Go to the Vercel Dashboard to see the deployment status: </b>
                    <a
                      href="https://vercel.com/old-mc-donald-s/old-mcdonalds-website/deployments"
                      target="_blank"
                    >
                      Vercel Deployments
                    </a>
                    <p><b>Public Site:</b> Changes will be visible in 1-2 minutes</p>
                    <p><b>Admin Site:</b> Changes should be visible instantly, after the next page is loaded</p>
                  </div>
                )}
                <details>
                  <summary>See full response</summary>
                  <pre>{JSON.stringify(response, null, 2)}</pre>
                </details>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
