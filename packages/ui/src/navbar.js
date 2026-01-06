"use client"
import { useEffect, useRef, useState } from "react"
import styles from "./navbar.module.css"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { CaretDown, CaretUp, MapTrifold } from "phosphor-react"
import React from "react"

const MORE_MENU_ID = "navbar-more-menu"

const mergeClassNames = (...classNames) => classNames.filter(Boolean).join(' ')

const Navbar = ({
    items,
    primaryKeys,
    titleText,
    auxiliaryItems
}) => {
    const primaryItems = items.filter((item) => primaryKeys.has(item.key))
    const secondaryItems = items.filter((item) => !primaryKeys.has(item.key))
    const hasSecondaryItems = secondaryItems.length > 0



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
        <>
            <a href="#skip-navbar" className="
                absolute z-[1000]
                -left-[9999px]
                focus:left-5
                p-5
                bg-white
            "
            >Skip to main content</a>
            <header className={styles.navbar}>
                <a href="/" aria-label="Home"><h1>{titleText}</h1></a>
                <nav>
                    <ul>
                        {primaryItems.map(renderNavItem)}
                        {hasSecondaryItems && (
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
                                    {secondaryItems.map(renderNavItem)}
                                </ul>
                            </li>
                        )}
                    </ul>
                </nav>
                {
                    auxiliaryItems ? (
                        <div className="hidden md:flex flex-row gap-2 items-stretch">
                            {auxiliaryItems.map(({ href, children, label }, index) => {
                                return (
                                    <a
                                        key={index}
                                        href={href}
                                        aria-label={label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`rounded-full p-1.5 flex items-center justify-center hover:scale-105 transition-all shadow-md` + (index % 2 === 0 ? " bg-accent" : " bg-foreground")}
                                    >
                                        {children}
                                    </a>
                                )
                            })}
                        </div>
                    ) : null
                }
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
                            {items.map((item) => (
                                <li key={item.path} className={pathname === item.path ? styles.active : null}>
                                    <a href={item.path}>{item.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {
                        auxiliaryItems ? (
                            <div className={`flex md:hidden flex-row gap-2 items-stretch`}>
                                {auxiliaryItems.map(({ href, children, label }, index) => {
                                    return (
                                        <a
                                            key={index}
                                            href={href}
                                            aria-label={label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-full p-1.5 flex items-center justify-center hover:scale-105 transition-all shadow-md` + (index % 2 === 0 ? " bg-accent" : " bg-foreground")}
                                        >
                                            {children}
                                        </a>
                                    )
                                })}
                            </div>
                        ) : null
                    }
                </div>
                <div id="skip-navbar" className="hidden"></div>
            </header>
        </>
    )
}

export { Navbar };