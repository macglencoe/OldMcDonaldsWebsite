import Layout from "@/components/layout"
import styles from "./page.module.css"
import { AndImage } from "@/components/andImage"

export const PumpkinPatch = () => {
    return (
        <Layout>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Pumpkin Patch</h1>
                    <span>2025 Season</span>
                </div>
                <div className={styles.body}>
                    <AndImage src="https://www.imperial-library.info/wp-content/uploads/image-2-1024x737.png">
                        <h2>Where is it?</h2>
                        <p>The two pumpkin patches can be found beyond the corn maze, just along the farm lane</p>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1696629842172-1b71b45e8e07?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Pricing</h2>
                        <p>Pumpkins from the patch are priced at:</p>
                        <p className={styles.big}><u>$0.50 / pound</u></p>
                        <p>Pay at the weighing station, near the entrance to the corn maze.</p>
                        <p>Cash and cards accepted</p>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1740578266454-eee1d51fe7ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Transportation</h2>
                        <p>If you want to pick multiple pumpkins, you may want to use a wagon</p>
                        <p>You can <b>grab a wagon</b> from the entrance, or bring your own. Don't be afraid to share wagons!</p>
                    </AndImage>
                    <AndImage src="https://images.unsplash.com/photo-1507919181268-0a42063f9704?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                        <h2>Variety</h2>
                        <p>We grow a diverse range of pumpkins, including (but not limited to):</p>
                        <ul>
                            <li>Traditional carving pumpkins</li>
                            <li>Decorative gourds</li>
                            <li>Winter squash</li>
                            <li>Ornamental varieties</li>
                        </ul>
                    </AndImage>
                    <AndImage src="https://preview.redd.it/oimju2x5eax41.jpg?width=640&crop=smart&auto=webp&s=81616ac7a07b76ced24a06968dc9dc6475a3fb05">
                        <h2>Do's and Don'ts</h2>
                        <p>Don't:</p>
                        <ul>
                            <li>Destroy Pumpkins</li>
                            <li>Abuse the carts</li>
                            <li>Pick pumpkins you don't intend on purchasing</li>
                        </ul>
                        <p>Do:</p>
                        <ul>
                            <li>Smoke Skooma</li>
                            <li>Smoke Skooma</li>
                            <li>Smoke Skooma</li>
                        </ul>
                    </AndImage>
                </div>
            </div>
        </Layout>
    )
}

export default PumpkinPatch