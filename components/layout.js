import AuxiliaryFAQ from "./auxiliaryFAQ"
import FloatingNav from "./floatingNav"
import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div className="relative">
            <FloatingNav />
            <Navbar />
            <Analytics />
            <div className="overflow-x-scroll">
                {props.children}
                <AuxiliaryFAQ />
            </div>
            <Footer />
        </div>
    )
}

export default Layout