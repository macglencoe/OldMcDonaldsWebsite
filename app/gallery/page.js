import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'
import Layout from '@/components/layout';
import styles from './page.module.css'
import PageHeader from '@/components/pageHeader';
import photoOps from '@/public/data/photoOps.json'
import { FileImage, Upload } from 'phosphor-react';
import PhotoOpsListClient from './photoOpsListClient';
import UploadSectionClient from './uploadSectionClient';
import CostumeContestClient from './costumeContestClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Gallery"
}

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
            <PageHeader>Gallery</PageHeader>
            <div className='body basic'>
                <CostumeContestClient />
                <div className={styles.socials}>
                    <h2>Share your moments:</h2>
                    <div>
                        <a href='https://www.instagram.com/explore/locations/199254807111825/old-mcdonalds-pumpkin-patch-and-corn-maze/' className={styles.tag + ' ' + styles.instagram}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24"><path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"></path></svg>
                            <span>Tag our location on Instagram</span>
                        </a>
                        <a href='https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze/' className={styles.tag + ' ' + styles.facebook}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50"><path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path></svg>
                            <span>Tag our page on Facebook</span>
                        </a>
                        <a href='https://www.tiktok.com/@glencoefarmwv' className={styles.tag + ' ' + styles.tiktok}>
                            <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 449.45 515.38"><path fillRule="nonzero" d="M382.31 103.3c-27.76-18.1-47.79-47.07-54.04-80.82-1.35-7.29-2.1-14.8-2.1-22.48h-88.6l-.15 355.09c-1.48 39.77-34.21 71.68-74.33 71.68-12.47 0-24.21-3.11-34.55-8.56-23.71-12.47-39.94-37.32-39.94-65.91 0-41.07 33.42-74.49 74.48-74.49 7.67 0 15.02 1.27 21.97 3.44V190.8c-7.2-.99-14.51-1.59-21.97-1.59C73.16 189.21 0 262.36 0 352.3c0 55.17 27.56 104 69.63 133.52 26.48 18.61 58.71 29.56 93.46 29.56 89.93 0 163.08-73.16 163.08-163.08V172.23c34.75 24.94 77.33 39.64 123.28 39.64v-88.61c-24.75 0-47.8-7.35-67.14-19.96z"/></svg>
                            <span>Tag our page on TikTok</span>
                        </a>
                    </div>
                    <UploadSectionClient uploadUrl={""} title={"Want your photo featured?"} subtitle={"Upload a photo!"} id={"upload"}/>
                </div>

                <PhotoOpsListClient photoOps={photoOps} />


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
