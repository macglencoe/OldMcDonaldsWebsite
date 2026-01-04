import AuxiliaryFAQ from "./auxiliaryFAQ"
import { FloatingNav } from "@oldmc/ui"
import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"
import QrTracker from "./qrTracker"
import { Suspense } from "react"
import { Navbar } from "@oldmc/ui"
import Navigation from "./navigation"

const Layout = (props) => {
    return (
        <div className="relative">
            <Navigation />
            
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