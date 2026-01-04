import AuxiliaryFAQ from "./auxiliaryFAQ"
import FloatingNav from "./floatingNav"
import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"
import QrTracker from "./qrTracker"
import { Suspense } from "react"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div className="relative">
            <FloatingNav />
            <Navbar 
                titleText="Old McDonald's"
                items={[
                    { key: "activities", title: "Activities", path: '/activities' },
                    { key: "about", title: "About", path: '/about' },
                    { key: "reservations", title: "Reservations", path: '/reservations' },
                    { key: "faq", title: "FAQ", path: '/faq' },
                    { key: "gallery", title: "Gallery", path: '/gallery' },
                    { key: "pricing", title: "Pricing", path: '/pricing' }
                ]}
                primaryKeys={new Set(["activities", "reservations", "pricing"])}
            />
            <Analytics />
            <Suspense fallback={null}><QrTracker /></Suspense>
            <div className="overflow-x-scroll">
                {props.children}
                <AuxiliaryFAQ />
            </div>
            <Footer />
        </div>
    )
}

export default Layout