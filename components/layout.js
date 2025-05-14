import Footer from "./footer"

const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout