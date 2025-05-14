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
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1696629842172-1b71b45e8e07?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <a href="activities/pumpkin-patch"><h2 className={styles.light}>Pumpkin Patch</h2></a>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1611942110143-7f81974e49cd?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <a href="activities/corn-maze"><h2 className={styles.light}>Corn Maze</h2></a>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1637062771078-eca465634238?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Playground</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1731320965879-2b4a4ca70d81?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Tube Slides</h2>
                    </div>
                    <div className={styles.smallActivity}>
                        <img className={styles.backdrop} src="https://media-cdn.tripadvisor.com/media/photo-m/1280/1e/27/41/ca/gravity-box-basketball.jpg"></img>
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
                        <img className={styles.backdrop} src="https://plus.unsplash.com/premium_photo-1664355811395-265c2c8051d4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <h2 className={styles.light}>Petting Zoo</h2>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1473554198449-fd330ccd766e?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <a href="activities/hayrides"><h2 className={styles.light}>Hayrides</h2></a>
                    </div>
                    <div className={styles.mediumActivity}>
                        <img className={styles.backdrop} src="https://images.unsplash.com/photo-1626186241349-5d5f44407f55?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <a href="../vendors"><h2 className={styles.light}>Food Vendors & Picnic Tables</h2></a>
                    </div>
                    <div className={styles.largeActivity}>
                        <img className={styles.backdrop} src="https://plus.unsplash.com/premium_photo-1665311552973-53cdaeaa52c3?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <a href="activities/nature-trails"><h2 className={styles.light}>Nature Trails</h2></a>
                    </div>
                    
                </div>
            </div>

        </Layout>
    );
}