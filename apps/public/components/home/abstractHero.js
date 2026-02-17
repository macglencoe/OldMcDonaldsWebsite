import Link from "next/link"
import styles from "./hero.module.css"
import Image from "next/image"
import AbstractHeroClient from "./abstractHeroClient"

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
            <AbstractHeroClient
                tagline={tagline}
                description={description}
                cta={cta}
                seasonInfo={seasonInfo}
            />
        </section>
    )
}