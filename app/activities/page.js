import Layout from "@/components/layout";
import styles from "./page.module.css";

export default function Activities() {
    return (
        <Layout>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Activities</h1>
                    <span>2025 Season</span>
                </div>
                <div className={styles.activitySpread}>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="/pumpkinlanes.jpg"></img>
                        <a href="activities/pumpkin-patch"><h2 className={styles.light}>Pumpkin Patch</h2></a>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="/sunflowerBike.jpg"></img>
                        <a href="activities/flower-fields"><h2 className={styles.light}>Flower Fields</h2></a>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="/cornMazeLane.jpg"></img>
                        <a href="activities/corn-maze"><h2 className={styles.light}>Corn Maze</h2></a>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1637062771078-eca465634238?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Playground</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="/tubeSlides.jpg"></img>
                        <h2 className={styles.light}>Tube Slides</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1683688520618-35a12caa059f?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Basketball Wagon</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1566579090262-51cde5ebe92e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Football Nets</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1636483022717-3eeaa9ff1a4f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Corn Hole</h2>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="/pettingZooGoatAndGirl.jpg"></img>
                        <a href="activities/petting-zoo"><h2 className={styles.light}>Petting Zoo</h2></a>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="/tractorSunset.jpg"></img>
                        <a href="activities/hayrides"><h2 className={styles.light}>Hayrides</h2></a>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="/picnicTable.jpg"></img>
                        <a href="../vendors"><h2 className={styles.light}>Food Vendors & Picnic Tables</h2></a>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="/natureMazePath.jpg"></img>
                        <a href="activities/nature-trails"><h2 className={styles.light}>Nature Trails</h2></a>
                    </div>
                    
                </div>
            </div>

        </Layout>
    );
}