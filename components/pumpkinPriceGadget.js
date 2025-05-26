'use client'

import { useState, useRef, useEffect } from 'react'

export default function PumpkinPriceGadget() {
    const [weight, setWeight] = useState(20)
    const price = (weight * 0.5).toFixed(2)
    const scale = 0.5 + (weight / 70) * 1.5
    const sliderRef = useRef(null)
    const [handleX, setHandleX] = useState(0)

    // Fun comparison messages based on weight
    const funFacts = [
        { min: 1, max: 3, message: "A newborn piglet"},
        { min: 4, max: 6, message: "A grown chicken"},
        { min: 7, max: 14, message: "A bucket of paint"},
        { min: 15, max: 25, message: "A car tire"},
        { min: 26, max: 35, message: "A toddler"},
        { min: 36, max: 45, message: "5 gallons of water"},
        { min: 46, max: 55, message: "A grown goat"},
        { min: 56, max: 65, message: "A wet bale of hay"},
        { min: 66, max: 70, message: "A newborn calf"},
    ]

    const comparisonMessage =
        funFacts.find(({ min, max }) => weight >= min && weight <= max)?.message ?? ''

    useEffect(() => {
        if (sliderRef.current) {
            const { offsetWidth } = sliderRef.current
            const percent = (weight - 1) / (70 - 1)
            const thumbSize = 16
            setHandleX(percent * (offsetWidth - thumbSize))
        }
    }, [weight])

    const markers = [1, 70]

    return (
        <section className="w-full flex flex-col justify-center items-center bg-background text-foreground p-6">
            <div className="text-center mb-8">
            </div>

            <div className="relative w-full max-w-3xl">
                {/* Floating label above slider handle */}
                <div
                    className="absolute -top-8 transform -translate-x-1/2 bg-accent text-background text-sm font-semibold px-2 py-1 rounded shadow whitespace-nowrap"
                    style={{ left: `${handleX}px` }}
                >
                    {weight} lb
                </div>

                {/* Slider */}
                <input
                    ref={sliderRef}
                    type="range"
                    min="1"
                    max="70"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full appearance-none bg-accent h-2 rounded-lg cursor-pointer"
                />

                {/* Tick markers */}
                <div className="absolute top-4 left-0 right-0 flex justify-between text-sm text-accent px-[2px]">
                    {markers.map((m) => (
                        <div key={m} className="flex flex-col items-center w-0">
                            <div className="h-4 w-px bg-accent" />
                            <span className="mt-1">{m}lb</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-5'>
                {comparisonMessage && (
                    <p className="text-accent mt-2 text-center max-w-sm italic">{comparisonMessage}</p>
                )}
            </div>


            <div className="flex flex-col md:flex-row justify-center items-center gap-0 md:gap-4">
                <div
                    className="transition-fontSize duration-300"
                    style={{ fontSize: `${scale * 7}rem` }}
                >
                    🎃
                </div>
                <div className="text-xl font-semibold">
                    ${price}
                </div>
            </div>
        </section>
    )
}
