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
                    imgSrc="/doggystyle.jpg"
                    website="https://example.com"
                />
                <VendorProfile
                    name="Twisted Taters"
                    subtitle="Butterfly Potatoes & more"
                    imgSrc="/twistedTaters.jpg"
                    website="https://example.com"
                />
                <VendorProfile
                    name="Old McDonuts"
                    subtitle="Donuts, Coffee, and Slushies"
                    imgSrc="/oldMcDonuts.jpg"
                    website="/vendors/old-mcdonuts"
                />
            </div>
        </Layout>
    )
}

export default Vendors