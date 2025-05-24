import Layout from '@/components/layout'
import styles from './page.module.css'
import { AndImage } from '@/components/andImage';

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
                <AndImage fromUnsplash={true} src="https://images.unsplash.com/photo-1603643205616-5e029797b7c2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>10 acres of fun</h2>
                    <p>We have two corn mazes, each being 5 acres in area</p>
                    <p>In order to get to Maze #2, you must first traverse Maze #1 😱</p>
                    <a className="button" href='/map?x=39.382729123233055&y=-78.04341793391379'>Find on the Map</a>
                </AndImage>
                <AndImage fromUnsplash style="night" src="https://images.unsplash.com/photo-1603174378108-63103ad2f24b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <div className={styles.nightMaze}>
                        <h2>Night Maze</h2>
                        <p>Starting on October nth, we will have the maze open from 7pm to 10:30pm</p>
                        <p>Bring your flashlight and your friends for a spooky night on the farm</p>
                        <a href='/activities/night-maze' className={styles.button}>See More</a>
                    </div>

                </AndImage>
                <AndImage fromUnsplash src="https://images.unsplash.com/photo-1530194031436-911753a437bf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Maze Game</h2>
                    <p>Go on a fun scavenger hunt through the corn maze!</p>
                    <p>Find the <b>4 QR codes</b> hidden throughout the maze</p>
                    <a href='/maze-game' className="button">See More</a>
                </AndImage>
                <div className={styles.rules}>
                    <h2>Rules</h2>
                    <p>In order to preserve the corn for harvest, and to ensure all visitors can have a fun experience, we ask that you respect these rules:</p>
                    <ol>
                        <li><b>Leave No Trace:</b> Do not leave any trash or personal items in the corn maze. Anything you leave in the maze will be plowed into the soil next summer, and reclaimed by the dark embrace of mother earth.</li>
                        <li>Do not break corn stalks, or blaze your own paths. The corn maze should remain a maze, and its form should remain unmolested by the impatient.</li>
                        <li>Refrain from eating the corn. You are human. This corn is meant for animals. Is it your wish to be an animal?</li>
                        <li>If you insist on running, do so mindful of the fact that there are roots, rocks, and foliage abound in the lanes. Corn is an excellent sound insulator, and if you fall, nobody will hear you.</li>
                        <li>Consider the weather conditions before entering, and your apparel's suitability for the task.</li>
                    </ol>
                </div>
            </div>
            <div className={styles.pastMazes + ' body basic'}>
                <h2>Past Maze Designs</h2>
                <ul>
                    <li>
                        <img src='/2024maze.avif'></img>
                        <span>2024</span>
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
                        <span>idk</span>
                    </li>
                    <li>
                        <img src='/eatLocalMaze.avif'></img>
                        <span>idk</span>
                    </li>
                    <li>
                        <img src='/looseLipsMaze.avif'></img>
                        <span>idk</span>
                    </li>
                    <li>
                        <img src='/mountaineersMaze.avif'></img>
                        <span>idk</span>
                    </li>
                    <li>
                        <img src='/noahsArkMaze.avif'></img>
                        <span>idk</span>
                    </li>
                    <li>
                        <img src='/protectedMaze.avif'></img>
                        <span>idk</span>
                    </li>

                </ul>
            </div>
        </Layout>
    )
}

export default CornMaze;