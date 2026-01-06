"use client";

import { Gear } from "phosphor-react";

export default function () {
    return (
        <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
            <div className="font-bold text-xl text-center relative" style={{
                fontFamily: 'monospace'
            }}>
                <div className="flex items-center justify-center w-64 h-64 relative mx-auto mb-4">
                    <Gear className="
                    absolute
                    top-1/2 -translate-y-1/2
                    left-1/2 -translate-x-1/2
                    opacity-10
                    w-64 h-64
                    animate-spin [animation-duration:20s]
                " weight="thin" />
                    <p className="text-4xl">404</p>
                </div>
                <p>This page does not exist.<br />Neither does anything else.</p>


            </div>
        </div>
    )
}