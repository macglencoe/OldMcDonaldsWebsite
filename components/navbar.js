"use client"
import { useEffect, useRef, useState } from "react"
import styles from "./navbar.module.css"
import { usePathname } from "next/navigation"
import mapIcon from '@/public/icons/map.svg?raw'
import Link from "next/link"
import { track } from "@vercel/analytics"
import { CaretDown, CaretUp } from "phosphor-react"

const NAV_ITEMS = [
    { key: "activities", title: "Activities", path: '/activities' },
    { key: "about", title: "About", path: '/about' },
    { key: "reservations", title: "Reservations", path: '/reservations' },
    { key: "faq", title: "FAQ", path: '/faq' },
    { key: "gallery", title: "Gallery", path: '/gallery' },
    { key: "pricing", title: "Pricing", path: '/pricing' },
]

const PRIMARY_KEYS = new Set(["activities", "reservations", "pricing"])
const PRIMARY_ITEMS = NAV_ITEMS.filter((item) => PRIMARY_KEYS.has(item.key))
const SECONDARY_ITEMS = NAV_ITEMS.filter((item) => !PRIMARY_KEYS.has(item.key))
const HAS_SECONDARY_ITEMS = SECONDARY_ITEMS.length > 0
const MORE_MENU_ID = "navbar-more-menu"

const mergeClassNames = (...classNames) => classNames.filter(Boolean).join(' ')

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const pathname = usePathname()
    const moreRef = useRef(null)

    useEffect(() => {
        setIsOpen(false)
        setIsMoreOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!isMoreOpen) {
            return
        }

        const handlePointer = (event) => {
            if (moreRef.current && moreRef.current.contains(event.target)) {
                return
            }
            setIsMoreOpen(false)
        }

        const handleKey = (event) => {
            if (event.key === "Escape") {
                setIsMoreOpen(false)
                const toggle = moreRef.current?.querySelector('button')
                toggle?.focus()
            }
        }

        document.addEventListener('pointerdown', handlePointer)
        document.addEventListener('keydown', handleKey)

        return () => {
            document.removeEventListener('pointerdown', handlePointer)
            document.removeEventListener('keydown', handleKey)
        }
    }, [isMoreOpen])

    const renderNavItem = (item) => (
        <li key={item.path} className={pathname === item.path ? styles.active : undefined}>
            <a href={item.path}>{item.title}</a>
        </li>
    )

    const moreToggleClassName = mergeClassNames(
        styles.moreToggle,
        isMoreOpen ? styles.moreToggleOpen : undefined
    )
    const moreMenuClassName = mergeClassNames(
        styles.moreMenu,
        isMoreOpen ? styles.moreMenuOpen : undefined
    )

    return (
        <header className={styles.navbar + " relative"}>
            <a href="#skip-navbar" className="absolute right-1/2 text-center underline bg-background py-3 px-4 opacity-0 focus:opacity-100 -translate-y-[150%] focus:translate-y-0 transition-all duration-200">Skip to main content</a>
            <a href="/" aria-label="Home"><h1>Old McDonald's</h1></a>
            <nav>
                <ul>
                    {PRIMARY_ITEMS.map(renderNavItem)}
                    {HAS_SECONDARY_ITEMS && (
                        <li className={styles.more} ref={moreRef}>
                            <button
                                type="button"
                                className={moreToggleClassName}
                                aria-haspopup="true"
                                aria-expanded={isMoreOpen}
                                aria-controls={MORE_MENU_ID}
                                onClick={() => setIsMoreOpen((prev) => !prev)}
                            >
                                More
                                <CaretUp width={45} weight="bold" height={45} aria-hidden="true" className={styles.chevron}></CaretUp>
                            </button>
                            
                            <ul
                                id={MORE_MENU_ID}
                                className={moreMenuClassName}
                                hidden={!isMoreOpen}
                                aria-hidden={!isMoreOpen}
                            >
                                {SECONDARY_ITEMS.map(renderNavItem)}
                            </ul>
                        </li>
                    )}
                    <li key="map" className={pathname === "/map" ? styles.active : null}>
                        <Link href="/map">
                            <span dangerouslySetInnerHTML={{ __html: mapIcon }} />
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.buttons}>
                <a href="tel:304-839-2330" onClick={() => {
                    track('Call Button', { location: 'Navbar' })
                }}>Call</a>
                <a href="/visit">Visit</a>
            </div>
            <div className={styles.mobileNav}>
                <Link className={styles.mobileMap + (pathname === "/map" ? " " + styles.active : "")} href="/map">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" /></svg>
                </Link>
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
                        {NAV_ITEMS.map((item) => (
                            <li key={item.path} className={pathname === item.path ? styles.active : null}>
                                <a href={item.path}>{item.title}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.buttons + ' ' + styles.mobile}>
                    <a href="tel:304-839-2330" onClick={() => {
                        track('Call Button', { location: 'Navbar' })
                    }}>Call</a>
                    <a href="/visit">Visit</a>
                </div>
            </div>
            <div id="skip-navbar" className="hidden"></div>
        </header>
    )
}

export default Navbar
