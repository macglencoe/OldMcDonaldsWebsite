import Link from "next/link"
import styles from "./hero.module.css"
import Image from "next/image"

/**
 * Renders a reusable hero section with a backdrop image, tagline, CTA buttons, and seasonal information.
 *
 * @component
 *
 * @param {Object} props - Component properties
 * @param {Object} [props.backdrop] - Optional image to display as the background
 * @param {string} props.backdrop.src - Path to the image file
 * @param {string} [props.backdrop.blurDataURL] - Low-res placeholder image used for blur-up effect
 * @param {string} [props.backdrop.alt="Seasonal Hero Backdrop"] - Alternative text for the image
 *
 * @param {string} [props.tagline="Real Farm Fun"] - Headline displayed in the hero
 * @param {string} [props.description] - Paragraph beneath the tagline
 *
 * @param {Object} [props.cta] - Call-to-action section
 * @param {string} [props.cta.description] - Optional CTA description
 * @param {Array<Object>} props.cta.buttons - List of CTA buttons
 * @param {string} props.cta.buttons[].href - Link target for the button
 * @param {() => void} [props.cta.buttons[].onClick] - Optional click handler
 * @param {string} props.cta.buttons[].label - Visible text of the button
 * @param {React.ComponentType<{ size?: number, weight?: string }>} [props.cta.buttons[].Icon] - Optional icon component (e.g., from phosphor-react)
 *
 * @param {Object} [props.seasonInfo] - Additional card section for season-specific content
 * @param {string} [props.seasonInfo.title] - Heading for the season info card
 * @param {string} [props.seasonInfo.content] - Body text of the season info card
 *
 * @returns {JSX.Element} Hero section component
 */
export default function AbstractHero({
    backdrop,
    tagline = "Real Farm Fun",
    description = "Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family",
    cta,
    seasonInfo
}) {
    return (
        <section className={styles.hero}>
            {backdrop && backdrop.src && typeof backdrop?.src === 'string' &&
                <Image
                    src={backdrop.src}
                    placeholder={backdrop.blurDataURL ? "blur" : undefined}
                    blurDataURL={backdrop.blurDataURL || undefined}
                    priority
                    alt={backdrop.alt || "Seasonal Hero Backdrop"}
                    width={1500}
                    height={1500}
                ></Image>
            }
            <div className={styles.cover}>
                <div className={styles.top}>
                    <h1 className={styles.tagline}>{tagline}</h1>
                    <div>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    {cta &&
                        <div className={styles.cta}>
                            {cta.description &&
                                <p>{cta.description}</p>
                            }
                            {cta.buttons && Array.isArray(cta.buttons) &&
                                <div className={styles.buttons}>
                                    {cta.buttons.map((button, index) => {
                                        const isExternal = typeof button.href === 'string' && button.href.startsWith('http');
                                        return (
                                            <Link
                                                key={index}
                                                href={button.href}
                                                onClick={button.onClick}
                                                target={
                                                    isExternal ? '_blank' : undefined
                                                }
                                            >
                                                {button.Icon &&
                                                    <button.Icon size={24} weight="bold" />
                                                }
                                                {button.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    }
                    {seasonInfo &&
                        <div className={styles.seasonInfo}>
                            <div className={styles.card}>
                                {seasonInfo.title && <h2>{seasonInfo.title}</h2>}
                                {seasonInfo.content && <p>{seasonInfo.content}</p>}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}