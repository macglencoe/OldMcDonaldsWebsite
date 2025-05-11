"use client"
import { useState } from "react"
import styles from "./navbar.module.css"

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className={styles.navbar}>
            <h1>Old McDonald's</h1>
            <nav>
                <ul>
                    <li><a href="/activities">Activities</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="/reservations">Reservations</a></li>
                    <li><a href="/faq">FAQ</a></li>
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
                        <li><a href="/activities">Activities</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="/reservations">Reservations</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar