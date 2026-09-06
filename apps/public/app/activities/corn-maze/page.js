import Layout from '@/components/layout'
import styles from './page.module.css'
import {
    ArticleDivider,
    ArticleFacts,
    ArticleLayout,
    ArticleLead,
    ArticleNotice,
    ArticleRules,
    ArticleSection,
} from '@/components/article';
import PageHeader from '@/components/pageHeader';
import { Action } from "@oldmc/ui";
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
            <ArticleLayout>
                <ArticleLead
                    image="/cornMazeEntrance.jpg"
                    imageAlt="Entrance to the Old McDonald's corn maze"
                    imageFocalPoint="center 44%"
                    heading="5 acres of fun"
                >
                    <p>Lose yourself in our 5-acre corn maze</p>
                    <p>Our corn maze is carefully designed each year to be both challenging and fun, all while having an over-arching theme.</p>
                </ArticleLead>

                <ArticleNotice title="2026 - Coming Soon">
                    <p>Check back soon for more information about this year&apos;s corn maze!</p>
                </ArticleNotice>

                <ArticleFacts items={[
                    { value: "5", label: "Acres", detail: "Total maze area" },
                    { value: "~20", label: "Minutes", detail: "Average completion time" },
                    { value: "1", label: "Theme", detail: "New each year" },
                ]} />

                <ArticleSection imageAttribution tone="night" imagePosition="left" imageRatio="landscape" imageFocalPoint="center 58%" imageAlt="A dark cornfield at night" image="https://images.unsplash.com/photo-1603174378108-63103ad2f24b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <div className={styles.nightMaze}>
                        <h2>Night Maze</h2>
                        <p>After the sun sets, the corn maze becomes a new, spooky challenge.</p>
                        <p>Starting October 16th, come back after dark and find your way through the maze without the help of daylight.</p>
                        <Action as='Link' href='/activities/night-maze' variant='secondary' className={'mx-auto'}>See More</Action>
                    </div>
                </ArticleSection>

                { isFeatureEnabled('maze_game_enabled') &&
                    <ArticleSection image="/cornMazeLane.jpg" imageAlt="A path between tall rows of corn" imageRatio="landscape" imageFocalPoint="center 65%">
                        <h2>Maze Game</h2>
                        <p>Hidden throughout the maze are stations with <b>QR Codes</b> to scan.</p>
                        <p>Think you can find all four?</p>
                        <Action as='Link' href={'/maze-game'} variant='primary' className={'mx-auto'}>See More</Action>
                    </ArticleSection>
                }

                <ArticleRules
                    title="Rules"
                    intro="In order to preserve the corn for harvest, and to ensure all visitors can have a fun experience, we ask that you respect these rules:"
                    items={[
                        { title: "Leave No Trace", description: "Do not leave any trash or personal items in the corn maze. Anything you leave in the maze will be tilled into the soil next summer, never to be seen again except by mother Earth herself." },
                        { title: "Don't pick, snap, or stomp the corn", description: "It took months to grow and weeks to design. Let's keep it pretty for other visitors to enjoy!" },
                        { title: "Refrain from eating the corn", description: "You are human. This corn is meant for animals." },
                        { title: "Running is forbidden" },
                        { title: "Consider the weather conditions", description: "It is liable to be muddy. Dress for the farm, not the runway." },
                    ]}
                />


                <section className={styles.pastMazes}>
                    <header>
                        <h2>Past Maze Designs</h2>
                    </header>
                    <ul>
                        {pastMazes.map(({ year, image, caption }) => (
                            <li key={year}>
                                <img src={image} alt={caption}></img>
                                <span>{year}{caption && ` - ${caption}`}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </ArticleLayout>
        </Layout>
    )
}
