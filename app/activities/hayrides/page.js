import Layout from '@/components/layout'
import styles from './page.module.css'
import { AndImage } from '@/components/andImage'

export const HayRide = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>Hay Rides</h1>
                <span>2025 Season</span>
            </div>
            <div className='body basic'>
                <AndImage src='https://images.unsplash.com/photo-1712915755681-574c13516bb0?q=80&w=1754&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'>
                    <h2>A tour of the farm</h2>
                    <p>Relax on a 20-minute haywagon ride with scenic views of the property</p>
                </AndImage>
                <AndImage src='https://images.unsplash.com/photo-1580243981343-ca4d8f0143c9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'>
                    <h2>Pricing</h2>
                    <p>For one person, above 3 years of age:</p>
                    <p className='big'>$4</p>
                    <p>Must be paid at the admission booth</p>
                </AndImage>
                <AndImage src='https://images.unsplash.com/photo-1526410393023-6aace519592a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'>
                    <h2>When to get on</h2>
                    <p>Each ticket has a <b>color</b> and a <b>time</b> written on the back</p>
                    <p>When your time comes, go to the hayride corral, which is across the creek</p>
                    <p>The drivers will direct you to the correct wagon, and take your ticket</p>
                </AndImage>
            </div>
        </Layout>
    )
}

export default HayRide