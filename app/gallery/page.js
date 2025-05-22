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
                <div className={styles.socials}>
                    <h2>Share your moments:</h2>
                    <div className={styles.tag + ' ' + styles.instagram}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24"><path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path></svg>
                        <a href='https://www.instagram.com/explore/locations/199254807111825/old-mcdonalds-pumpkin-patch-and-corn-maze/'>@oldmcdonalds</a>
                    </div>

                </div>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((fileName) => (
                        <div key={fileName} className="aspect-square relative rounded overflow-hidden shadow-lg group hover:scale-105 transition-transform">
                            <a href={`/gallery/${fileName}`}>
                                <Image
                                    src={`/gallery/${fileName}`}
                                    fill
                                    alt={fileName}
                                    className="object-cover"
                                />
                            </a>
                        </div>
                    ))}
                </div>


            </div>

        </Layout>
    )
}
