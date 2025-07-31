import Layout from '@/components/layout'
import styles from './page.module.css'
import { AndImage } from '@/components/andImage';
import { BodyBlock } from '@/components/bodyBlock';
import { isFeatureEnabled } from '@/public/lib/featureEvaluator';

export const CornMaze = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>Corn Maze</h1>
                <span>2025 Season</span>
            </div>
            <div className='body basic'>
                <div className={styles.cornMaze}>
                    <img src='/charleswmcdonaldmaze.jpg'>
                    </img>
                    <h2>2024 - Rest In Peace</h2>
                    <p>Last year's maze was in memory of my father, Charles W. McDonald, and my grandfather, Charles W. McDonald</p>
                    <p><b>We're still working on the maze for 2025. Stay tuned!</b></p>
                </div>
                <BodyBlock src="/cornMazeEntrance.jpg">
                    <h2>10 acres of fun</h2>
                    <p>Lose yourself in one of our two 5-acre corn mazes!</p>
                    <p>Our corn mazes are carefully designed each year to be both challenging and fun, all while having an over-arching theme.</p>
                    <p>(On average, our mazes take 20 minutes to complete)</p>
                    <a className="button" href='/map?x=39.382729123233055&y=-78.04341793391379'>Find on the Map</a>
                </BodyBlock>
                <BodyBlock fromUnsplash style="night" src="https://images.unsplash.com/photo-1603174378108-63103ad2f24b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <div className={styles.nightMaze}>
                        <h2>Night Maze</h2>
                        <p>After the sun sets, the corn maze becomes a new, spooky challenge</p>
                        <p>Starting October 17th, come back after dark and find your way through the maze without the help of daylight</p>
                        <a href='/activities/night-maze' className={styles.button}>See More</a>
                    </div>

                </BodyBlock>
                { isFeatureEnabled('maze_game_enabled') &&
                    <BodyBlock src="/cornMazeLane.jpg">
                        <h2>Maze Game</h2>
                        <p>Hidden throughout the maze are stations with <b>QR Codes</b> to scan.</p>
                        <p>Think you can find all four?</p>
                        <a href='/maze-game' className="button">See More</a>
                    </BodyBlock>
                }
                <BodyBlock>
                    <h2>Rules</h2>
                    <p>In order to preserve the corn for harvest, and to ensure all visitors can have a fun experience, we ask that you respect these rules:</p>
                    <ol>
                        <li><b>Leave No Trace:</b> Do not leave any trash or personal items in the corn maze. Anything you leave in the maze will be tilled into the soil next summer, never to be seen again except by mother Earth herself.</li>
                        <li><b>Don't pick, snap, or stomp the corn.</b> It took months to grow and weeks to design. Let's keep it pretty for other visitors to enjoy!</li>
                        <li><b>Refrain from eating the corn</b>. You are human. This corn is meant for animals.</li>
                        <li><b>Running is highly discouraged!</b> The maze is full of roots and rocks, and corn muffles sound surprisingly well.</li>
                        <li><b>Consider the weather conditions</b>: It is liable to be muddy. Dress for the farm, not the runway.</li>
                    </ol>
                </BodyBlock>
            </div>
            <div className={styles.pastMazes + ' body basic'}>
                <h2>Past Maze Designs</h2>
                <ul>
                    <li>
                        <img src='/2024maze.avif'></img>
                        <span>2023</span>
                    </li>
                    <li>
                        <img src='/2021maze.avif'></img>
                        <span>2021</span>
                    </li>
                    <li>
                        <img src='/2020maze.avif'></img>
                        <span>2020</span>
                    </li>
                    <li>
                        <img src='/americaMaze.avif'></img>
                        <span>2012</span>
                    </li>
                    <li>
                        <img src='/looseLipsMaze.avif'></img>
                        <span>2016</span>
                    </li>
                    <li>
                        <img src='/noahsArkMaze.avif'></img>
                        <span>2015</span>
                    </li>
                    <li>
                        <img src='/mountaineersMaze.avif'></img>
                        <span>2014</span>
                    </li>
                    <li>
                        <img src='/eatLocalMaze.avif'></img>
                        <span>2011</span>
                    </li>
                    <li>
                        <img src='/protectedMaze.avif'></img>
                        <span>2008</span>
                    </li>

                </ul>
            </div>
        </Layout>
    )
}

export default CornMaze;