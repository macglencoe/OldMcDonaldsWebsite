"use client";

import { CaretDown } from "phosphor-react";

export default function PreviewDivider() {
    return <div className="flex flex-col items-center justify-center" style={{
        backgroundImage: `repeating-linear-gradient(
                    45deg,
                    #ffdeb8,
                    #ffdeb8 10px,
                    #ffffff 10px,
                    #ffffff 20px
                )`
    }}>
        <h2 className="text-xl font-bold text-gray-900 py-2 text-center tracking-wider uppercase">
            Preview
        </h2>
        <CaretDown size={20} weight="bold" className="mx-auto -mt-3 mb-2 inline-block" />
    </div>
}