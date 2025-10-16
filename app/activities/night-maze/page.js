import Layout from "@/components/layout";
import styles from "./page.module.css";
import { AndImage } from "@/components/andImage";

export const metadata = {
    title: "Night Maze",
    description: "Brave the spooky Night Maze at Old McDonald’s Pumpkin Patch. Explore the corn maze after dark with hayrides, campfires, vendors, and fall night fun."
}

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
                        <h2>October 17th</h2>
                        <p>Starting in October, we will have the maze and hayrides open from 7:30pm to 10:30*</p>
                        <small>*Last admission at 10:00</small>
                    </AndImage>
                    <AndImage style="night" src="https://images.unsplash.com/photo-1715520928476-cd350276d96e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=779">
                        <h2>Pricing</h2>
                        <div className="rounded-lg overflow-hidden">
                            <div className="p-4 bg-foreground/20">
                                <h3 className="font-bold !font-serif">Admission:</h3>
                                <p><span className="text-7xl font-bold">$7</span>, per person*</p>
                                <p className="italic mt-3">Includes:</p>
                                <ul>
                                    <li>Night Maze</li>
                                    <li>Campfires</li>
                                    <li>Playground</li>
                                    <li>Access to market & vendors</li>
                                </ul>
                            </div>
                            <hr className="border-background/30" />
                            <div className="p-4 bg-foreground/40">
                                <h3 className="font-bold !font-serif">Admission + Hayride:</h3>
                                <p><span className="text-7xl font-bold">$10</span>, per person*</p>
                                <p className="italic mt-3">Includes:</p>
                                <ul>
                                    <li>Everything above</li>
                                    <li>1 hayride ticket</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-foreground/60">
                                <p className="text-center">Must be paid at the admission booth</p>
                            <p className="!text-sm text-center">*Children 3 and under are free</p>
                            </div>
                        </div>
                    </AndImage>
                    <AndImage style="night" src="/bonfires.jpg">
                        <h2 id="reservations">Reservations</h2>
                        <div className="rounded-lg overflow-hidden">
                            <div className="p-4 bg-foreground/20">
                                <p>Have a big group? Rent a <strong>campfire</strong> for your visit!</p>
                                <p><span className="text-7xl font-bold">$50</span>, per night</p>
                            </div>
                            <div className="p-4 bg-foreground/40">
                                <h3 className="font-bold !font-serif">Seating</h3>
                                <ul>
                                    <li>2 benches provided</li>
                                    <li>You may bring additional seating</li>
                                </ul>
                            </div>
                            <hr className="border-background/30" />
                            <div className="p-4 bg-foreground/40">
                                <h3 className="font-bold !font-serif">Campfire</h3>
                                <ul>
                                    <li>Includes 1 bundle of firewood</li>
                                    <li>Additional firewood must be purchased</li>
                                </ul>
                            </div>
                        </div>
                    </AndImage>
                </div>
            </Layout>
        </div>
    );
};

export default NightMaze;