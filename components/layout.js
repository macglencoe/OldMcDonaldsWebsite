import AuxiliaryFAQ from "./auxiliaryFAQ"
import BreadCrumbNavigation from "./breadcrumb"
import FloatingNav from "./floatingNav"
import Footer from "./footer"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div className="relative">
            <FloatingNav />
            <Navbar />
            <BreadCrumbNavigation />
            <div className="overflow-x-scroll">
                {props.children}
                <AuxiliaryFAQ />
            </div>
            <Footer />
        </div>
    )
}

export default Layout