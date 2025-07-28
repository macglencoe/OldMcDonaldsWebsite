import Image from 'next/image'
import styles from './andImge.module.css'

export const AndImage = ({ src, children, style, fromUnsplash, alt = '' }) => {
    return (
        <div className={`
            flex flex-col md:flex-row
            items-stretch md:items-center
            justify-center
            gap-8 md:gap-12
            p-6 md:p-12
            max-w-7xl mx-auto
            transition-all duration-500 ease-in-out
            ${styles.andImage}
            ${style === "night" ? styles.night : ""}
        `}>
            <div className={`
                bg-accent/10 dark:bg-accent/20
                shadow-lg rounded-xl overflow-hidden
                backdrop-blur-md
                flex-2 min-w-[300px]
                transition-all duration-500 ease-in-out
                ${styles.backdrop}
            `}>
                <div className={`
                    flex flex-col justify-center gap-4
                    p-6 md:p-10
                    text-lg leading-relaxed
                    text-foreground dark:text-foreground/90
                    font-serif tracking-wide
                    ${style === "night" ? "text-nightMazeForeground" : ""}
                    ${styles.content}
                `}>
                    {children}
                </div>
            </div>
            <div className={`
                relative z-0 flex justify-center items-center
                flex-1 max-w-full md:max-w-md
                group
                ${styles.image}
            `}>
                <Image
                    src={src}
                    alt={alt}
                    width={600}
                    height={400}
                    className={`
                        h-[22em] md:h-[26em]
                        w-full md:w-auto
                        object-cover rounded-lg shadow-2xl
                        transform group-hover:scale-105 transition-transform duration-500 ease-out
                        border-4 border-white dark:border-nightMazeAccent/40
                    `}
                />
                {fromUnsplash && 
                    <div className={`
                        absolute bottom-2 left-2
                        px-2 py-1
                        text-xs font-medium
                        bg-black/40 text-white
                        rounded-sm backdrop-blur-sm
                        transition-opacity duration-300 group-hover:opacity-100 opacity-80
                        ${styles.overlay}
                    `}>
                        <a className="hover:underline" href="/attribution">Attribution</a>
                    </div>
                }
            </div>
        </div>
    )
}
