import Layout from '@/components/layout'
import styles from './page.module.css'
import { AndImage } from '@/components/andImage'
import pricing from '@/public/data/pricing'

export const HayRide = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>Hay Rides</h1>
                <span>2025 Season</span>
            </div>
            <div className='body basic'>
                <AndImage src='/hillview.jpg'>
                    <h2>A tour of the farm</h2>
                    <p>Relax on a 20-minute haywagon ride with scenic views of the property</p>
                </AndImage>
                <AndImage src='/pondeastdock.jpg'>
                    <h2>Pricing</h2>
                    <p>For one person, above 3 years of age:</p>
                    <p className='big'>${pricing.hayride.amount}</p>
                    <p>Must be paid at the admission booth</p>
                    <p>If you plan on bringing a large group, make sure your group is all together at the admission booth</p>
                </AndImage>
                <AndImage src='/hayrideGroupPhoto.jpg'>
                    <h2>When to get on</h2>
                    <p>Each ticket has a <b>color</b> and a <b>time</b> written on the back</p>
                    <p>Arrive <b>before</b> the time on your ticket.</p>
                    <p>When your time comes, go to the hayride corral, which is across the creek</p>
                    <a className='button' href='/map?x=39.382529281329774&y=-78.04355774914931'>Find on the Map</a>
                    <p>The drivers will direct you to the correct wagon, and take your ticket</p>
                </AndImage>
                <AndImage fromUnsplash style="night" src="https://images.unsplash.com/photo-1707755939969-e9c1da71c5bb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <div className={styles.nightMaze}>
                        <h2>Hayrides at night</h2>
                        <p>Starting October nth, we will have hayrides open from 7pm to 10:30pm</p>
                        <p>Bring your friends and some warm clothes for a spooky tour of the deep dark forest at night</p>
                        <a href='/activities/night-maze' className={styles.button}>See More</a>
                    </div>
                </AndImage>
            </div>
        </Layout>
    )
}

export default HayRide