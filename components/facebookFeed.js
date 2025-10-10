"use client"
import { FacebookLogo, InstagramLogo, TiktokLogo } from 'phosphor-react'
import styles from './facebookFeed.module.css'
import { track } from '@vercel/analytics'
import { isFeatureEnabled } from '@/public/lib/featureEvaluator'
export default function FacebookFeed() {
    return (
        <div className="relative">
            <img src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="absolute w-full h-full object-cover z-0 left-0 top-0" ></img>
            <div className={`relative flex md:flex-row flex-col justify-evenly py-6 md:p-6 backdrop-blur-sm standard-backdrop` + " " + styles.container}>
                    <a tabIndex={0} className='absolute top-0 text-center underline text-background opacity-0 focus:opacity-100' href='#skip-feed'>Skip Facebook Feed</a>
                <div className="flex flex-col align justify-center items-center md:mr-4 md:mb-0 mb-4 gap-6 z-2">
                    <h2 className="text-background text-4xl md:text-6xl font-bold font-[Satisfy]">Stay Updated</h2>
                    <p className='text-background text-2xl'>Follow us on our socials</p>
                    <div className="flex flex-row gap-4">
                        <a href='https://www.facebook.com/oldmcdonaldspumpkinpatchandcornmaze' target="_blank"><FacebookLogo size={32} color="var(--background)" weight="fill" onClick={() => {
                            track(
                                'Social Link Click',
                                { location: 'Socials Section (Home)', platform: 'facebook' }
                            )
                        }}/></a>
                        <a href='https://www.instagram.com/oldmcdonaldspumpkin/' target="_blank"><InstagramLogo size={32} color="var(--background)" weight="fill" onClick={() => {
                            track(
                                'Social Link Click',
                                { location: 'Socials Section (Home)', platform: 'instagram' }
                            )
                        }}/></a>
                        <a href='https://www.tiktok.com/@glencoefarmwv' target="_blank"><TiktokLogo size={32} color="var(--background)" weight="fill" onClick={() => {
                            track(
                                'Social Link Click',
                                { location: 'Socials Section (Home)', platform: 'tiktok' }
                            )
                        }}/></a>
                    </div>
                </div>
                { isFeatureEnabled('show_facebook_feed') &&
                    <iframe className="z-2" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Foldmcdonaldspumpkinpatchandcornmaze&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId" width="320" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                }
                <div className='absolute' id='skip-feed' />
            </div>
        </div>
    )
}