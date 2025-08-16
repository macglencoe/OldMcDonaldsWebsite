import Layout from '@/components/layout'
import styles from './page.module.css'
import VendorProfile from '@/components/vendorProfile'
import PageHeader from '@/components/pageHeader'

export const Vendors = () => {
    return (
        <Layout>
            <PageHeader subtitle="2025 Season">Vendors</PageHeader>
            <div className="body basic !pb-6">
                <a className='button' href='/map?x=39.38310990806668&y=-78.04274712816566'>Find on the Map</a>
                <VendorProfile
                    name="Old McDonuts"
                    subtitle="Donuts, Coffee, and Slushies"
                    imgSrc="/oldMcDonuts.jpg"
                    description="Classic fall flavors, always fresh and delicious"
                    menu="/vendors/old-mcdonuts"
                />
                <VendorProfile
                    name="Twisted Taters"
                    subtitle="Butterfly Potatoes & more"
                    description="Crispy and delicious butterfly potatoes, and much more"
                    imgSrc="/twistedTaters.jpg"
                />
                <VendorProfile
                    name="Doggystyle"
                    subtitle="Hotdogs"
                    imgSrc="/doggystyle.jpg"
                    description="Veteran owned and operated, all beef hotdogs with lots of toppings"
                    website="https://www.facebook.com/doggystylewv/"
                />
            </div>
        </Layout>
    )
}

export default Vendors