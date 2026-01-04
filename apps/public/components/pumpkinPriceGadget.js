'use client'

import { useState, useRef, useEffect } from 'react';
import pricing from "@/public/data/pricing";

export default function PumpkinPriceGadget() {
    const [weight, setWeight] = useState(20)
    const price = (weight * pricing["pumpkin-patch"].amount).toFixed(2)
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
        { min: 66, max: 70, message: "A large bag of concrete"},
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


return (
    <section className="w-full flex flex-col items-center bg-background text-foreground  max-w-4xl mx-auto">

        <div className="relative w-full px-6 mb-10">
            {/* Floating label */}
            <div
                className="absolute -top-8 transform -translate-x-1/2 bg-accent text-background text-sm font-semibold px-3 py-1 rounded-xl shadow"
                style={{ left: `${handleX}px` }}
            >
                {weight} lb
            </div>

            {/* Slider input */}
            <input
                ref={sliderRef}
                type="range"
                min="1"
                max="70"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full appearance-none h-3 rounded-full bg-accent/20 accent-accent transition-all duration-300"
            />
        </div>

        {comparisonMessage && (
            <p className="text-accent text-center max-w-md italic mb-6">{comparisonMessage}</p>
        )}

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className='w-full md:w-[340px] h-[280px] flex items-center justify-center'>
                <div
                    className=" tritems-center justify-center text-center"
                    style={{ fontSize: `${scale * 5}rem`, transform: `scale(${scale})` }}
                >
                    🎃
                </div>
            </div>
            <div className="text-3xl font-bold text-accent">${price}</div>
        </div>
    </section>
)
}