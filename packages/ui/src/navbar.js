"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import styles from "./navbar.module.css"

const MORE_MENU_ID = "navbar-more-menu"
const MOBILE_MENU_ID = "navbar-mobile-menu"

const mergeClassNames = (...classNames) => classNames.filter(Boolean).join(" ")
const isExternalHref = (href) => /^(https?:|tel:|mailto:)/.test(href)

function NavLink({ href, className, children, external = false, onClick, ...props }) {
    if (external || isExternalHref(href)) {
        const opensNewWindow = external && /^https?:/.test(href)
        return (
            <a
                href={href}
                className={className}
                onClick={onClick}
                target={opensNewWindow ? "_blank" : undefined}
                rel={opensNewWindow ? "noopener noreferrer" : undefined}
                {...props}
            >
                {children}
            </a>
        )
    }

    return <Link href={href} className={className} onClick={onClick} {...props}>{children}</Link>
}

const Navbar = ({
    items,
    primaryKeys = new Set(),
    titleText,
    actionItem,
    mobileFooter,
    moreLabel = "More"
}) => {
    const pathname = usePathname()
    const primaryItems = items.filter((item) => primaryKeys.has(item.key))
    const secondaryItems = items.filter((item) => !primaryKeys.has(item.key))
    const hasSecondaryItems = secondaryItems.length > 0

    const [isOpen, setIsOpen] = useState(false)
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const moreRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const mobileToggleRef = useRef(null)

    const isItemActive = (item) => (
        pathname === item.path || (item.path !== "/" && pathname.startsWith(`${item.path}/`))
    )

    useEffect(() => {
        setIsOpen(false)
        setIsMoreOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!isMoreOpen) return

        const handlePointer = (event) => {
            if (!moreRef.current?.contains(event.target)) setIsMoreOpen(false)
        }
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setIsMoreOpen(false)
                moreRef.current?.querySelector("button")?.focus()
            }
        }

        document.addEventListener("pointerdown", handlePointer)
        document.addEventListener("keydown", handleKey)
        return () => {
            document.removeEventListener("pointerdown", handlePointer)
            document.removeEventListener("keydown", handleKey)
        }
    }, [isMoreOpen])

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        const focusableSelector = "a[href], button:not([disabled])"
        const menuItems = () => [...mobileMenuRef.current?.querySelectorAll(focusableSelector) ?? []]
        const focusableItems = () => [mobileToggleRef.current, ...menuItems()].filter(Boolean)
        const focusTimer = window.setTimeout(() => {
            menuItems()[0]?.focus({ preventScroll: true })
        }, 50)

        const handleKey = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false)
                mobileToggleRef.current?.focus()
                return
            }
            if (event.key !== "Tab") return

            const elements = focusableItems()
            if (!elements.length) return
            const first = elements[0]
            const last = elements[elements.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", handleKey)
        return () => {
            window.clearTimeout(focusTimer)
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", handleKey)
        }
    }, [isOpen])

    const closeMobileMenu = () => setIsOpen(false)

    const renderNavItem = (item, mobile = false) => {
        const active = isItemActive(item)
        return (
            <li key={item.path} className={active ? styles.active : undefined}>
                <NavLink
                    href={item.path}
                    external={item.external}
                    aria-current={active ? "page" : undefined}
                    onClick={mobile ? closeMobileMenu : undefined}
                >
                    {item.title}
                </NavLink>
            </li>
        )
    }

    return (
        <>
            <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
            <header className={styles.navbar} data-testid="site-nav">
                <div className={styles.inner}>
                    <NavLink href="/" className={styles.brand} aria-label={`${titleText} home`}>
                        {titleText}
                    </NavLink>

                    <nav className={styles.desktopNav} aria-label="Primary navigation">
                        <ul>
                            {primaryItems.map((item) => renderNavItem(item))}
                            {hasSecondaryItems && (
                                <li
                                    className={mergeClassNames(
                                        styles.more,
                                        secondaryItems.some(isItemActive) ? styles.active : undefined
                                    )}
                                    ref={moreRef}
                                >
                                    <button
                                        type="button"
                                        className={styles.moreToggle}
                                        aria-haspopup="true"
                                        aria-expanded={isMoreOpen}
                                        aria-controls={MORE_MENU_ID}
                                        onClick={() => setIsMoreOpen((open) => !open)}
                                    >
                                        {moreLabel}
                                        <svg className={styles.chevron} viewBox="0 0 20 20" aria-hidden="true">
                                            <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <ul id={MORE_MENU_ID} className={styles.moreMenu} hidden={!isMoreOpen}>
                                        {secondaryItems.map((item) => renderNavItem(item))}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {actionItem && (
                        <NavLink
                            href={actionItem.href}
                            external={actionItem.external}
                            className={styles.desktopAction}
                        >
                            {actionItem.title}
                            <span aria-hidden="true">↗</span>
                        </NavLink>
                    )}

                    <button
                        ref={mobileToggleRef}
                        type="button"
                        className={styles.mobileToggle}
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isOpen}
                        aria-controls={MOBILE_MENU_ID}
                        onClick={() => setIsOpen((open) => !open)}
                    >
                        <span aria-hidden="true" className={styles.menuIcon}>
                            <i></i><i></i><i></i>
                        </span>
                    </button>
                </div>

                <div
                    id={MOBILE_MENU_ID}
                    ref={mobileMenuRef}
                    className={mergeClassNames(styles.mobileMenu, isOpen ? styles.mobileMenuOpen : undefined)}
                    aria-hidden={!isOpen}
                >
                    <div className={styles.mobileMenuInner}>
                        {actionItem && (
                            <NavLink
                                href={actionItem.href}
                                external={actionItem.external}
                                className={styles.mobileAction}
                                onClick={closeMobileMenu}
                            >
                                {actionItem.title}
                                <span aria-hidden="true">↗</span>
                            </NavLink>
                        )}
                        <nav aria-label="Mobile navigation">
                            <ul>{items.map((item) => renderNavItem(item, true))}</ul>
                        </nav>
                        {mobileFooter && <div className={styles.mobileFooter}>{mobileFooter}</div>}
                    </div>
                </div>
            </header>
        </>
    )
}

export { Navbar }
