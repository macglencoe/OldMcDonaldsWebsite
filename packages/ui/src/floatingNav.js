"use client"

import { ArrowUp } from "phosphor-react";
import { useEffect, useState } from "react";

export function FloatingNav({
    controls = [
        {
            id: 'scrollTop',
            label: 'Scroll to Top',
            children: <ArrowUp size={24} weight="bold" />,
            scrollToTop: true
        }
    ]
}) {
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
        const update = () => setHasScrolled(window.scrollY > 520)
        update()
        window.addEventListener('scroll', update, { passive: true })
        return () => window.removeEventListener('scroll', update)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const scrollToId = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    const visibleControls = hasScrolled ? controls : []

    if (visibleControls.length === 0) return null

    return (
        <div className="
            p-1 md:p-2 fixed bottom-2 md:bottom-5 right-2 md:right-5 z-[998]
            flex flex-row md:flex-col bg-accent/90 gap-1 md:gap-2
            rounded-full shadow-lg backdrop-blur-sm
        ">
            {visibleControls.map(control => (
                <NavButton
                    onClick={
                        control.scrollToTop ? scrollToTop :
                        control.scrollToId ? () => scrollToId(control.scrollToId) : undefined
                    }
                    id={control.id}
                    key={control.id}
                    label={control.label}
                >
                    {control.children}
                </NavButton>
            ))}
            {/* <NavButton onClick={scrollToTop} id="scrollTop">
                <ArrowUp size={24} weight="bold" />
            </NavButton>
            { hasFaq &&
                <NavButton onClick={() => scrollToId('faq')} id="scrollToFAQ">
                    FAQ
                </NavButton>
            } */}

        </div>
    )

}

function NavButton({ children, onClick, id, label }) {
    return (
        <button className="
        bg-background/20 hover:bg-background/10 rounded-full p-2 md:p-3
        text-background text-xs md:text-base
        cursor-pointer
        aspect-square flex items-center justify-center
        active:scale-125 active:bg-transparent
        transition-all
        " 
        onClick={onClick} id={id} aria-label={label} title={label}>
            {children}
        </button>
    )
}

