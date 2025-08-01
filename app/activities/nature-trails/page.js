import { AndImage } from '@/components/andImage';
import styles from './page.module.css'
import Layout from '@/components/layout';

export const NatureTrails = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>Nature Trails</h1>
                <span>2025 Season</span>
            </div>
            <div className='body basic'>
                <AndImage src="/walnutbottom.jpg">
                    <h2>Take a hike!</h2>
                    <p>Our lush forest has many trails just for visitors!</p>
                </AndImage>
                <AndImage src="/forestlane.jpg">
                    <h2>How do I get there?</h2>
                    <p>The forest is in the back corner of the farm</p>
                    <p>Go all the way out the lane, <b>almost</b> until you reach the pond</p>
                    <p>Turn <b>north</b>, and it's at the <b>top of the hill</b>.</p>
                    <a className='button' href='/map?x=39.38477237376192&y=-78.04864825577425'>Find on the Map</a>
                </AndImage>
                <AndImage fromUnsplash src="https://images.unsplash.com/photo-1653704597093-5d384b53cecc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                    <h2>Things to keep in mind</h2>
                    <ul>
                        <li>Consider the weather conditons. It is liable to be muddy</li>
                        <li>Stay in the mowed paths</li>
                    </ul>
                </AndImage>
            </div>
        </Layout>
    )
}

export default NatureTrails;