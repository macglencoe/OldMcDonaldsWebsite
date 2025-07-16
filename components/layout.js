import Footer from "./footer"
import { Analytics } from "@vercel/analytics/next"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            <Analytics />
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout