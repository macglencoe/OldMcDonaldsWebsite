const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            <div className="overflow-x-scroll">{props.children}</div>
        </div>
    )
}

export default Layout