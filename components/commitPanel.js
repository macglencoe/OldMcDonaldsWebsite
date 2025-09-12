"use client";
import { useState } from "react";

export default function CommitPanel({ content, filePath, title = "Commit" }) {
  const [responseConsole, setResponseConsole] = useState([]);
  const [isCommitting, setIsCommitting] = useState(false);

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
      <div className="flex flex-row gap-2">
        <button
          disabled={isCommitting}
          onClick={() => commitToGithub(["cms", "main"], defaultMessage)}
          className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
        >
          Commit to CMS + Main
        </button>
        <button
          disabled={isCommitting}
          onClick={() => commitToGithub(["testing"], defaultMessage)}
          className="bg-green-500 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
        >
          Commit to Testing
        </button>
      </div>

      {responseConsole.length > 0 && (
        <div className="mt-3">
          <ul>
            {responseConsole.map((response, index) => (
              <li key={index} className="m-3 bg-foreground/20 p-2 rounded-2xl">
                <div className="flex flex-row justify-between gap-4">
                  <h1>
                    {response.branch ? `[${response.branch}] ` : ""}
                    {response.status ? response.status + ": " : ""}
                    {response.statusText ?? "Unknown"}
                  </h1>
                  <p>{response.time ?? "Unknown"}</p>
                </div>
                <pre className="message-display">{response.message ?? "No message"}</pre>
                {response.status === 200 && (
                  <div className="vercel-deployments">
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

