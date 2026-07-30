import Layout from '@/components/layout'
import styles from './page.module.css'
import { AndImage } from '@/components/andImage';
import { BodyBlock } from '@/components/bodyBlock';
import PageHeader from '@/components/pageHeader';
import { Action } from "@oldmc/ui";
import Image from 'next/image';
import { getFlagEvaluator, getFlags } from '@/app/flags.server';

export const metadata = {
    title: "Corn Maze",
    description: "Get lost in Old McDonald’s 10-acre corn maze in Inwood, WV. Try daytime and spooky night mazes, complete challenges, and enjoy fall family fun."
}

const pastMazes = [
    {
        year: 2025,
        image: '/maze2025.JPG',
        caption: 'Martinsburg 1877 - Flooded Corn Maze'
    },
    {
        year: 2024,
        image: '/charleswmcdonaldmaze.jpg',
        caption: 'Rest in Peace Charles W. McDonald'
    },
    {
        year: 2023,
        image: '/2024maze.avif',
        caption: '#FFA Strong'
    },
    {
        year: 2021,
        image: '/2021maze.avif',
        caption: 'May the Norse be with you'
    },
    {
        year: 2020,
        image: '/2020maze.avif',
        caption: 'Grown in the USA'
    },
    {
        year: 2012,
        image: '/americaMaze.avif',
        caption: 'Believe in America'
    },
    {
        year: 2016,
        image: '/looseLipsMaze.avif',
        caption: 'Loose Lips Sink Ships'
    },
    {
        year: 2015,
        image: '/noahsArkMaze.avif',
        caption: 'Noah\'s Ark'
    },
    {
        year: 2014,
        image: '/mountaineersMaze.avif',
        caption: 'Mountaineers are Always Free'
    },
    {
        year: 2011,
        image: '/eatLocalMaze.avif',
        caption: 'Eat Local'
    },
    {
        year: 2008,
        image: '/protectedMaze.avif',
        caption: 'This Land is Protected Forever'
    },
]

export default async function CornMaze() {
    const flags = await getFlags();
    const isFeatureEnabled = getFlagEvaluator(flags);
    return (
        <Layout>
            <PageHeader subtitle="2026 Season">Corn Maze</PageHeader>
            <div className='body basic'>
                <div className={styles.cornMaze}>
                    {/* <Image width={1000} height={1000} src='/maze2025.JPG' /> */}
                    <div className={styles.placeholder + ' bg-radial from-orange-200 to-40% to-transparent flex items-center justify-center'}>
                        <p className='mx-auto my-auto text-center text-5xl! font-bold'>?</p>
                    </div>
                    <h2 className='text-center my-3 !text-3xl md:my-6 md:!text-5xl'>2026 - Coming Soon</h2>
                    <p className='text-center'>Check back soon for more information about this year&apos;s corn maze!</p>
                </div>
                <BodyBlock src="/cornMazeEntrance.jpg">
                    <h2>10 acres of fun</h2>
                    <p>Lose yourself in one of our two 5-acre corn mazes!</p>
                    <p>Our corn mazes are carefully designed each year to be both challenging and fun, all while having an over-arching theme.</p>
                    <p>(On average, our mazes take 20 minutes to complete)</p>
                    <Action as='Link' href='/map?x=39.381930379079186&y=-78.04549890656193' variant='primary' className='mx-auto'>Find on the Map</Action>
                </BodyBlock>
                <BodyBlock fromUnsplash style="night" src="https://images.unsplash.com/photo-1603174378108-63103ad2f24b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <div className={styles.nightMaze}>
                        <h2>Night Maze</h2>
                        <p>After the sun sets, the corn maze becomes a new, spooky challenge</p>
                        <p>Starting October 17th, come back after dark and find your way through the maze without the help of daylight</p>
                        <Action as='Link' href='/activities/night-maze' variant='secondary' className={'mx-auto'}>See More</Action>
                    </div>

                </BodyBlock>
                { isFeatureEnabled('maze_game_enabled') &&
                    <BodyBlock src="/cornMazeLane.jpg">
                        <h2>Maze Game</h2>
                        <p>Hidden throughout the maze are stations with <b>QR Codes</b> to scan.</p>
                        <p>Think you can find all four?</p>
                        <Action as='Link' href={'/maze-game'} variant='primary' className={'mx-auto'}>See More</Action>
                    </BodyBlock>
                }
                <BodyBlock>
                    <h2>Rules</h2>
                    <p>In order to preserve the corn for harvest, and to ensure all visitors can have a fun experience, we ask that you respect these rules:</p>
                    <ol>
                        <li><b>Leave No Trace:</b> Do not leave any trash or personal items in the corn maze. Anything you leave in the maze will be tilled into the soil next summer, never to be seen again except by mother Earth herself.</li>
                        <li><b>Don&apos;t pick, snap, or stomp the corn.</b> It took months to grow and weeks to design. Let&apos;s keep it pretty for other visitors to enjoy!</li>
                        <li><b>Refrain from eating the corn</b>. You are human. This corn is meant for animals.</li>
                        <li><b>Running is forbidden</b></li>
                        <li><b>Consider the weather conditions</b>: It is liable to be muddy. Dress for the farm, not the runway.</li>
                    </ol>
                </BodyBlock>
            </div>
            <div className={styles.pastMazes + ' body basic'}>
                <h2>Past Maze Designs</h2>
                <ul>
                    {pastMazes.map(({ year, image, caption }) => (
                        <li key={year}>
                            <img src={image} alt={caption}></img>
                            <span>{year}{caption && ` - ${caption}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}
