import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'
import Layout from '@/components/layout';
import styles from './page.module.css'

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {

    const galleryDir = path.join(process.cwd(), 'public', 'gallery');

    let allFiles;

    try {
        allFiles = await fs.readdir(galleryDir);
    } catch (e) {
        console.error('Could not read gallery directory:', e)
        allFiles = [];
    }

    // Filter to only image files (jpg, png, gif, etc.)
    const images = allFiles.filter((file) =>
        /\.(jpe?g|png|gif|webp|avif)$/i.test(file)
    )

    return (
        <Layout>
            <div className='header'>
                <h1>Gallery</h1>
            </div>
            <div className='body basic'>
                <h2>Tag us!</h2>
                <p>Use the <u><i>#oldmcdonaldspumpkinpatch</i></u> hashtag on Instagram, or use our location tag!</p>
                <div className={styles.gallery}>
                    {images.map((fileName) => (
                        <div className={styles.item} key={fileName}>
                            <a href={`/gallery/${fileName}`}>
                                <Image
                                    src={`/gallery/${fileName}`}
                                    width={300}
                                    height={300}
                                    alt={fileName}
                                />
                            </a>
                        </div>

                    ))}
                </div>
            </div>

        </Layout>
    )
}
