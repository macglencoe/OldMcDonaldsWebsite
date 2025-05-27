"use client"
import { useState } from "react"
import styles from "./navbar.module.css"
import { usePathname, useRouter } from "next/navigation"
import mapIcon from '@/public/icons/map.svg?raw'

export const Navbar = () => {
    const items = [
        { title: "Activities", path: '/activities' },
        { title: "About", path: '/about' },
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
                    <li key="map" className={pathname === "/map" ? styles.active : null}>
                        <a href="/map">
                            <span dangerouslySetInnerHTML={{ __html: mapIcon }} />
                        </a>
                    </li>
                </ul>
            </nav>
            <div className={styles.buttons}>
                <a href="tel:304-839-2330">Call</a>
                <a href="/visit">Visit</a>
            </div>
            <div className={styles.mobileNav}>
                <a className={styles.mobileMap + (pathname === "/map" ? " " + styles.active : "")} href="/map">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" /></svg>
                </a>
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
                <div className={styles.buttons + ' ' + styles.mobile}>
                    <a href="tel:304-839-2330">Call</a>
                    <a href="/visit">Visit</a>
                </div>
            </div>
        </header>
    )
}

export default Navbar