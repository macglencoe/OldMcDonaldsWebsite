import AuxiliaryFAQ from "./auxiliaryFAQ"
import BreadCrumbNavigation from "./breadcrumb"
import Footer from "./footer"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
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