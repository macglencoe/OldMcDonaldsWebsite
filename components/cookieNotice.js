"use client"

import { useEffect, useState } from "react"


export default function CookieNotice() {
    const [visible, setVisible] = useState(false);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('cookieNoticeDismissed');
        if (!dismissed) setVisible(true);
    }, []);

    const handleDismiss = () => {
        setIsHiding(true);
        localStorage.setItem('cookieNoticeDismissed', 'true');
        setTimeout(() =>
            setVisible(false), 1000);
    }

    if (!visible) return null

    return (
        <div className={`bg-background border border-foreground/20 rounded-xl shadow-xl max-w-xl p-4 flex flex-col gap-4 justify-between items-center fixed bottom-4 left-4 z-[999] transition-opacity duration-500 ease-in-out ${
                isHiding ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-4xl font-bold text-foreground/70">Old McDonald had a <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank" rel="noopener noreferrer" className="text-accent">cookie</a>...</h1>
                <p className="text-lg md:text-xl text-foreground/70">And he's using it to make sure you get the best experience</p>
            </div>
            <div className="flex flex-row gap-4">
                <button className="text-background font-bold tracking-wider uppercase p-2 bg-foreground hover:bg-foreground/70 cursor-pointer"
                    onClick={handleDismiss}>
                    Dismiss
                </button>
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-background font-bold tracking-wider uppercase p-2 bg-accent hover:bg-accent/70 cursor-pointer">
                    Privacy Policy
                </a>
            </div>
        </div>
    )
}