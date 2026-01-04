"use client"

import { usePathname } from "next/navigation"
import { ArrowUp } from "phosphor-react";
import faq from '@/public/data/faq.json'

export default function FloatingNav() {
    const pathname = usePathname();

    const hasFaq = faq.some(item =>
        item.pages?.includes(pathname) // only true if this FAQ applies to current path
    );

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const scrollToId = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="
            p-1 md:p-2 fixed bottom-1 md:bottom-5 right-1 md:right-5 z-[1000] 
            flex flex-col bg-accent gap-3 
            rounded-full
        ">
            <NavButton onClick={scrollToTop} id="scrollTop">
                <ArrowUp size={24} weight="bold" />
            </NavButton>
            { hasFaq &&
                <NavButton onClick={() => scrollToId('faq')} id="scrollToFAQ">
                    FAQ
                </NavButton>
            }

        </div>
    )

}

function NavButton({ children, onClick, id }) {
    return (
        <button className="
        bg-background/20 hover:bg-background/10 rounded-full p-2 md:p-3 
        text-background text-sm md:text-lg 
        cursor-pointer
        aspect-square flex items-center justify-center
        active:scale-125 active:bg-transparent
        transition-all
        " 
        onClick={onClick} id={id}>
            {children}
        </button>
    )
}