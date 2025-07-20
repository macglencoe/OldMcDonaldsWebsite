import { useState } from "react";

function loadFlagsFromLocalStorage() {
  const savedFlags = localStorage.getItem('featureFlags');
  if (savedFlags) {
    return JSON.parse(savedFlags);
  }
}

export default function CommitDialog() {

    const [responseConsole, setResponseConsole] = useState('');

    const commitToGithub = async (commitData, branch, message) => {
        try {
            const filePath = encodeURIComponent('public/flags/featureFlags.json');
            const url = `/api/files/${filePath}`;

            setResponseConsole(c => [
                ...c,
                {
                    time: new Date().toISOString(),
                    status: 'standby',
                    statusText: 'Waiting...',
                    ok: true
                }
            ])

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    branch,
                    message,
                    content: JSON.stringify(commitData, null, 2)
                })
            });

            const payload = await response.json();

            setResponseConsole(c => c.slice(0, -1));

            console.log(payload);

            setResponseConsole(c => [
                ...c,
                {
                    time: new Date().toLocaleString(),
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    ...(response.ok
                        ? { message: payload.message, commitData: payload.result }
                        : { error: payload.error })
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
                const branches = ['cms', 'main'];
                for (const branch of branches) {
                    const flags = loadFlagsFromLocalStorage();
                    if (flags) {
                        commitToGithub(flags, branch, `Update feature flags: ${new Date().toLocaleString()}`);
                    }
                }
            }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
            >Commit</button>
            <button onClick={() => {
                const branches = ['testing'];
                for (const branch of branches) {
                    const flags = loadFlagsFromLocalStorage();
                    if (flags) {
                        commitToGithub(flags, branch, `Update feature flags: ${new Date().toLocaleString()}`);
                    }
                }
            }}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-3">
                    Commit to Testing
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