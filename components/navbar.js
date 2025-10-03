"use client"
import { useState } from "react"
import styles from "./navbar.module.css"
import { usePathname, useRouter } from "next/navigation"

export const Navbar = () => {
    const items = [
        { title: "View", path: "/"},
        { title: "Edit", path: "/edit"}
    ]
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname();

    return (
        <header className={styles.navbar + " relative"}>
            <a href="#skip-navbar" className="absolute right-1/2 text-center underline bg-background py-3 px-4 opacity-0 focus:opacity-100 -translate-y-[150%] focus:translate-y-0 transition-all duration-200">Skip to main content</a>
            <a href="/" aria-label="Home"><h1>OMPP Hayrides</h1></a>
            <nav>
                <ul>
                    {items.map((item) => (
                        <li key={item.path} className={pathname === item.path ? styles.active : null}>
                            <a href={item.path}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.mobileNav}>
                <button
                    onClick={() => setIsOpen(!isOpen)} className={styles.hamburger + (isOpen ? " " + styles.open : "")}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </button>
            </div>
            <div className={styles.menu + (isOpen ? " " + styles.open : "")}>
                <nav>
                    <ul>
                        {items.map((item) => (
                            <li key={item.path} className={pathname === item.path ? styles.active : null}>
                                <a href={item.path}>{item.title}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div id="skip-navbar" className="hidden"></div>
        </header>
    )
}

export default Navbar