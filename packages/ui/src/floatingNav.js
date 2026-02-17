"use client"

import { ArrowUp } from "phosphor-react";

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
            {controls.map(control => (
                <NavButton
                    onClick={
                        control.scrollToTop ? scrollToTop :
                        control.scrollToId ? () => scrollToId(control.scrollToId) : undefined
                    }
                    id={control.id}
                    key={control.id}
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

