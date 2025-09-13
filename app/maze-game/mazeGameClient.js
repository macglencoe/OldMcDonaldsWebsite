"use client"

import EntryForm from '@/components/mazeGameEntryForm'
import { useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import { isFeatureEnabled } from '@/public/lib/featureEvaluator'

export default function MazeGameClient() {
    const [mazeData, setMazeData] = useState({})
    const [foundCodes, setFoundCodes] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [formLinks, setFormLinks] = useState({ mazeEntry: '' })
    const [forceGoogleFormsClient, setForceGoogleFormsClient] = useState(false)
    const currentYear = String(new Date().getFullYear())

    useEffect(() => {
        if (typeof window === 'undefined') return

        // load maze data
        fetch('/data/maze-game.json')
            .then(res => res.json())
            .then(setMazeData)
            .catch(err => console.error(err))

        // load form links
        fetch('/data/form-links.json')
            .then(res => res.json())
            .then(setFormLinks)
            .catch(() => setFormLinks({ mazeEntry: '' }))

        // load found codes
        const stored = localStorage.getItem('maze-game')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) setFoundCodes(parsed)
            } catch (e) {
                console.error(e)
            }
        }

        // load submissions
        const subsRaw = localStorage.getItem('submissions')
        if (subsRaw) {
            try {
                const subs = JSON.parse(subsRaw)
                if (Array.isArray(subs) && subs.includes(currentYear)) {
                    setHasSubmitted(true)
                }
            } catch (e) {
                console.error('Could not parse submissions', e)
            }
        }

        // check local fallback cooldown shared with contact form
        try {
            const untilRaw = localStorage.getItem('email_disabled_until')
            if (untilRaw) {
                const until = parseInt(untilRaw, 10)
                if (!Number.isNaN(until) && Date.now() < until) {
                    setForceGoogleFormsClient(true)
                }
            }
        } catch {}
    }, [currentYear])

    const allFound =
        Object.keys(mazeData).length > 0 &&
        Object.keys(mazeData).every(code => foundCodes.includes(code))

    // Fire one-time analytics when all codes found
    useEffect(() => {
        if (!allFound) return
        try {
            const currentYear = String(new Date().getFullYear())
            const flagKey = `maze_allFound_${currentYear}`
            if (localStorage.getItem(flagKey) === '1') return

            const firstAtRaw = localStorage.getItem('first_found_at')
            const firstAt = firstAtRaw ? parseInt(firstAtRaw, 10) : NaN
            const elapsedMs = Number.isFinite(firstAt) ? Math.max(0, Date.now() - firstAt) : 0

            let sequence = ''
            try {
                const seqArr = JSON.parse(localStorage.getItem('maze-game') || '[]')
                if (Array.isArray(seqArr)) sequence = seqArr.join('>')
            } catch {}

            // analytics: All Codes Found (max 2 props)
            track('All Codes Found', { elapsed_ms: elapsedMs, sequence })
            localStorage.setItem(flagKey, '1')
        } catch {}
    }, [allFound])

    const handleEntrySubmit = async ({ name, phone }) => {
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    kind: 'maze',
                    text: `Name: ${name}\nPhone Number: ${phone}`,
                    html: `<p>Name: ${name}</p><p>Phone Number: ${phone}</p>`,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // record submission in localStorage
                const raw = localStorage.getItem('submissions')
                let subs = []
                try {
                    subs = raw ? JSON.parse(raw) : []
                } catch {
                    subs = []
                }
                if (!subs.includes(currentYear)) {
                    subs.push(currentYear)
                    localStorage.setItem('submissions', JSON.stringify(subs))
                }
                setHasSubmitted(true);

                // Show success message
                alert(`Thanks for playing, ${name}! Your entry for ${currentYear} has been recorded. If you win the drawing, we will contact you at ${phone}.`);
            } else {
                alert(`Submission failed: ${data.error || 'Unknown error'}`);
                // enable client-side fallback for 24h on limit errors
                if (response.status === 429 || data?.code === 'LIMIT_EXCEEDED' || /limit|quota|rate|daily/i.test(String(data.error))) {
                    try {
                        const until = Date.now() + 24 * 60 * 60 * 1000 // 24h
                        localStorage.setItem('email_disabled_until', String(until))
                        setForceGoogleFormsClient(true)
                    } catch {}
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    }

    return (
            <div className="body basic">
                <p className='big'><b>Find the QR codes</b></p>
                <p>There are <b>4 QR codes</b> hidden throughout the maze.</p>
                <p>Scan each of them with your phone camera. Your progress will be tracked here.</p>
                <p>Once you find them all, you can enter in a drawing for a <b>large pumpkin</b>.</p>
                <div className="grid grid-cols-2 border border-black w-full max-w-3xl mx-auto mb-4">
                    {Object.entries(mazeData).map(([code, { name, img }]) => (
                        <div
                            key={code}
                            className="
                                flex flex-col text-center items-center justify-around
                                border border-black border-opacity-10
                                p-2 gap-1
                                w-full
                                min-h-[clamp(150px,30vw,200px)]
                            "
                        >
                            <span className="text-xl sm:text-2xl">{name}</span>

                            {foundCodes.includes(code) ? (
                                <img
                                    src={img}
                                    alt={name}
                                    className="
                                        object-cover rounded-lg
                                        w-[clamp(100px,40vw,200px)]
                                        h-[clamp(100px,40vw,200px)]
                                    "
                                />
                            ) : (
                                <span className="text-3xl sm:text-5xl">???</span>
                            )}

                            {foundCodes.includes(code) && (
                                <span className="text-sm sm:text-base">Found</span>
                            )}
                        </div>
                    ))}
                </div>


                {allFound && (
                    <div className="mt-6 text-center">
                        <p className="text-xl font-semibold">
                            🎉 Congratulations! You’ve found them all!
                        </p>
                        <p className="mt-2">Fill out the form below to enter the drawing:</p>

                        { (forceGoogleFormsClient || isFeatureEnabled('use_google_forms')) ? (
                            <div className="mt-4">
                                {forceGoogleFormsClient && (
                                    <div className="mb-3 p-3 rounded-md bg-accent/80 text-foreground border border-accent inline-block">
                                        <strong>High traffic detected:</strong> using our backup form so your entry is recorded.
                                    </div>
                                )}
                                <a
                                    href={formLinks.mazeEntry || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block bg-accent hover:bg-accent/70 !text-white font-semibold px-5 py-2 rounded ${!formLinks.mazeEntry ? 'pointer-events-none opacity-60' : ''}`}
                                >
                                    Open Maze Entry Form
                                </a>
                            </div>
                        ) : (
                            !hasSubmitted ? (
                                <EntryForm onSubmit={handleEntrySubmit} />
                            ) : (
                                <p className="mt-4 text-green-600">
                                    Thanks for entering! We’ve recorded your submission for {currentYear}.
                                </p>
                            )
                        )}
                    </div>
                )}
            </div>
    )
}
