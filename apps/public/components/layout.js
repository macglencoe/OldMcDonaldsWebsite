import AuxiliaryFAQ from "./auxiliaryFAQ"
import { FloatingNav } from "@oldmc/ui"
import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"
import QrTracker from "./qrTracker"
import { Suspense } from "react"
import Navigation from "./navigation"
import Announcements from "./announcements/announcements"

const Layout = (props) => {
    return (
        <div className="relative">
            <Navigation />
            <Announcements />
            <Analytics />
            <Suspense fallback={null}><QrTracker /></Suspense>
            <main id="main-content" tabIndex={-1} className="overflow-x-auto">
                {props.children}
                <AuxiliaryFAQ />
            </main>
            <Footer />
        </div>
    )
}

export default Layout
