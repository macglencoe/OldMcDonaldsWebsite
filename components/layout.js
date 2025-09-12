const { default: Navbar } = require("./navbar")


const Layout = (props) => {
    return (
        <div>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="overflow-x-auto">
                    {props.children}
                </div>
            </main>
        </div>
    )
}

export default Layout
