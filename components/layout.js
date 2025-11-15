import AuxiliaryFAQ from "./auxiliaryFAQ"
import FloatingNav from "./floatingNav"
import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"
import QrTracker from "./qrTracker"
import { Suspense } from "react"
import Announcements from "./announcements/announcements"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div className="relative">
            <FloatingNav />
            <Navbar />
            <Announcements />
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