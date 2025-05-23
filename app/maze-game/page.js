"use client"
import { useState, useEffect } from 'react'
import Layout from '@/components/layout'
import EntryForm from '@/components/mazeGameEntryForm'

export default function MazeGame() {
    const [mazeData, setMazeData] = useState({})
    const [foundCodes, setFoundCodes] = useState([])
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const currentYear = String(new Date().getFullYear())

    useEffect(() => {
        if (typeof window === 'undefined') return

        // load maze data
        fetch('/data/maze-game.json')
            .then(res => res.json())
            .then(setMazeData)
            .catch(err => console.error(err))

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
    }, [currentYear])

    const allFound =
        Object.keys(mazeData).length > 0 &&
        Object.keys(mazeData).every(code => foundCodes.includes(code))

    const handleEntrySubmit = ({ name, phone }) => {
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

        // TODO -- send email
        console.log('Entry submitted:', { name, phone })
        alert(`Thanks for playing, ${name}! If you win, we'll contact ${phone}.`)

        setHasSubmitted(true)
    }

    return (
        <Layout>
            <div className="header">
                <h1>Maze Game</h1>
                <span>2025 Season</span>
            </div>
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

                        {!hasSubmitted ? (
                            <EntryForm onSubmit={handleEntrySubmit} />
                        ) : (
                            <p className="mt-4 text-green-600">
                                Thanks for entering! We’ve recorded your submission for {currentYear}.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    )
}
