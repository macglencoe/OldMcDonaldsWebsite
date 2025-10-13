import { useState } from "react";

function loadFlagsFromLocalStorage() {
  const savedFlags = localStorage.getItem('featureFlags');
  if (savedFlags) {
    return JSON.parse(savedFlags);
  }
}

export default function CommitDialog() {

    const [responseConsole, setResponseConsole] = useState([]);

    const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");

    const uploadToBlob = async (commitData, label) => {
        try {
            const filePath = encodePath('flags.json');
            const url = `/api/blob/${filePath}`;

            setResponseConsole(c => [
                ...c,
                {
                    time: new Date().toISOString(),
                    statusText: `Uploading${label ? ` (${label})` : ''}...`,
                    ok: true
                }
            ])

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: JSON.stringify(commitData, null, 2),
                    contentType: "application/json"
                })
            });

            const payload = await response.json().catch(() => ({}));

            setResponseConsole(c => c.slice(0, -1)); // remove spinner entry

            const success = response.ok;
            setResponseConsole(c => [
                ...c,
                {
                    time: new Date().toLocaleString(),
                    status: response.status,
                    statusText: success ? "Blob updated" : "Upload failed",
                    ok: success,
                    label,
                    ...(success
                        ? { message: payload.message ?? 'Upload successful', blob: payload }
                        : { error: payload.message || payload.error || response.statusText })
                }
            ]);

        } catch (err) {
            console.error(err);
            setResponseConsole(c => [
                ...c,
                {
                    time: new Date().toLocaleString(),
                    statusText: 'error',
                    ok: false,
                    message: err.message
                }
            ]);
        }
    }

    return (
        <div>
            <button onClick={() => {
                const flags = loadFlagsFromLocalStorage();
                if (flags) {
                    uploadToBlob(flags, 'Publish');
                }
            }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
            >Upload</button>
            <button onClick={() => {
                const flags = loadFlagsFromLocalStorage();
                if (flags) {
                    uploadToBlob(flags, 'Upload (overwrite)');
                }
            }}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-3">
                    Upload (overwrite)
                </button>
            {responseConsole.length > 0 &&
                <div className='m-3'>
                    <ul>
                        {responseConsole.map((response, index) => {
                            return (
                                <li className={`m-3 bg-foreground/20 p-2 rounded-2xl`}>
                                    <div className='flex flex-row justify-between gap-4'>
                                        <h1>
                                            {response.status ? response.status + ": " : ""} {response.statusText ?? "Unknown"}
                                        </h1>
                                        <p>{response.time ?? "Unknown"}</p>
                                    </div>

                                    <pre className='message-display'>{response.message ?? "No message"}</pre>
                                    {response.status === 200 &&
                                        <div className='vercel-deployments'>
                                            <b>Go to the Vercel Dashboard to see the deployment status: </b>
                                            <a href='https://vercel.com/king-street-emporium/emporium-website/deployments' target='_blank'>Vercel Deployments</a>
                                            <p><b>Public Site:</b> Changes will be visible in 1-2 minutes</p>
                                            <p><b>Admin Site:</b> Changes should be visible instantly, after the next page is loaded</p>
                                        </div>
                                    }
                                    <details>
                                        <summary>See full response</summary>
                                        <pre>{JSON.stringify(response, null, 2)}</pre>
                                    </details>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
        </div>
    )
}
