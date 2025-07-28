"use client"
import { BookOpen } from 'phosphor-react'
import Image from 'next/image'
import styles from './oldMcDonutsAd.module.css'
import Link from 'next/link'

export default function OldMcDonutsAd( { title, description, href, src, alt, buttonText, menu } ) {
    return (
        <div className={styles.container}>
            <Image className={styles.backdrop} src={src} alt={alt} width={600} height={400}></Image>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
                <div>
                    { href && buttonText &&
                        <a className={styles.button} href={href}>{buttonText}</a>
                    }
                    { menu &&
                        <Link className={styles.button} href={menu}><BookOpen className='inline-block' size={34} weight="duotone" />&nbsp;&nbsp;Menu </Link>
                    }
                    <div className={styles.divider}></div>
                </div>
            </div>
        </div>
    )
}