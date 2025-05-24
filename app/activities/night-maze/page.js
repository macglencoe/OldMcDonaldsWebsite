import Layout from "@/components/layout";
import styles from "./page.module.css";
import { AndImage } from "@/components/andImage";

export const NightMaze = () => {
    return (
        <div className={styles.wrapper}>
            <Layout>
                <div className={styles.header + " header"}>
                    <h1>Night Maze</h1>
                    <span>2025 Season</span>
                </div>
                <div className={styles.body + " body basic"}>
                    <AndImage fromUnsplash style="night" src="https://images.unsplash.com/photo-1719254866686-43d6dfd08b5b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>October nth</h2>
                        <p>Starting in October, we will have the maze and hayrides open from 7pm to 10:30</p>
                    </AndImage>
                    <AndImage fromUnsplash style="night" src="https://images.unsplash.com/photo-1486679679458-629f321a617c?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Pricing</h2>
                        <p>For one person, above 3 years of age:</p><p className="big">$7</p>
                        <p>Must be paid at the admission booth</p>
                    </AndImage>
                    <AndImage fromUnsplash style="night" src="https://images.unsplash.com/photo-1520857622823-2df34928e183?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Includes:</h2>
                        <ul>
                            <li>Night Maze</li>
                            <li>Night Hayride</li>
                            <li>Campfires</li>
                            <li>Corn Crib</li>
                            <li>Access to vendors</li>
                        </ul>
                    </AndImage>
                </div>
            </Layout>
        </div>
    );
};

export default NightMaze;