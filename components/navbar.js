"use client"
import { useState } from "react"
import styles from "./navbar.module.css"
import { usePathname, useRouter } from "next/navigation"

export const Navbar = () => {
    const items = [
        { title: "Activities", path: '/activities' },
        { title: "About", path: '/#about' },
        { title: "Reservations", path: '/reservations' },
        { title: "FAQ", path: '/faq' },
        { title: "Gallery", path: '/gallery' },
    ]
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname();

    return (
        <header className={styles.navbar}>
            <a href="/"><h1>Old McDonald's</h1></a>
            <nav>
                <ul>
                    {items.map((item) => (
                        <li key={item.path} className={pathname === item.path ? styles.active : null}>
                            <a href={item.path}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.buttons}>
                <a href="tel:304-839-2330">Call</a>
                <a href="/visit">Visit</a>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)} className={styles.hamburger + (isOpen ? " " + styles.open : "")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </button>
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
                <div className={styles.buttons + ' ' + styles.mobile}>
                    <a href="tel:304-839-2330">Call</a>
                    <a href="/visit">Visit</a>
                </div>
            </div>
        </header>
    )
}

export default Navbar