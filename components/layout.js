const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            {props.children}
        </div>
    )
}

export default Layout