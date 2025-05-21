import Layout from '@/components/layout'
import styles from './page.module.css'
import VendorProfile from '@/components/vendorProfile'

export const Vendors = () => {
    return (
        <Layout>
            <div className='header'>
                <h1>Vendors</h1>
                <span>2025 Season</span>
            </div>
            <div className="body basic">
                <a className='button' href='/map?x=39.38310990806668&y=-78.04274712816566'>Find on the Map</a>
                <VendorProfile
                    name="Doggystyle"
                    subtitle="Hotdogs"
                    imgSrc="https://images.unsplash.com/photo-1620589125156-fd5028c5e05b?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    website="https://example.com"
                />
                <VendorProfile
                    name="Twisted Taters"
                    subtitle="Butterfly Potatoes & more"
                    imgSrc="https://images.unsplash.com/photo-1612208176815-e132bcf971b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    website="https://example.com"
                />
                <VendorProfile
                    name="Old McDonuts"
                    subtitle="Donuts, Coffee, and Slushies"
                    imgSrc="https://images.unsplash.com/photo-1683508860120-04c80c721095?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    website="https://example.com"
                />
            </div>
        </Layout>
    )
}

export default Vendors