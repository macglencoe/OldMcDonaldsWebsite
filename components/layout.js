import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            <Analytics />
            <div className="overflow-x-scroll">{props.children}</div>
            <Footer />
        </div>
    )
}

export default Layout