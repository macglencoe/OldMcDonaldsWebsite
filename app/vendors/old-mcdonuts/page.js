import Layout from "@/components/layout";
import styles from "./page.module.css"
import MenuItem from "@/components/menuItem";

export default function OldMcDonuts() {
    return (
        <Layout>
            <div className="header">
                <h1>Old McDonuts</h1>
                <span>Donuts & Coffee</span>
            </div>
            <div className="body basic overflow-hidden">
                <div className="flex flex-row gap-0 md:gap-4 relative md:justify-end">
                    <div className={`
                        flex flex-col
                        p-5 m-0 md:m-5
                        md:left-0
                        bg-amber-100
                        md:w-[300px]
                        absolute md:absolute 
                        md:min-h-0
                        inset-y-0 
                        justify-between
                        z-0
                        overflow-hidden
                        ${styles.images}`}>
                        <img src="https://images.unsplash.com/photo-1650846852086-a2a172d34dc5?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <img src="https://images.unsplash.com/photo-1704731838617-853be0d9c9fe?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                        <img src="https://images.unsplash.com/photo-1681366074660-c83f724ef5ae?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
                    </div>
                    <div className={`
                        flex flex-col 
                        p-7 m-0 md:m-5 
                        bg-amber-100 
                        flex-1/2 
                        z-10 
                        max-w-[80%] md:max-w-[70%] 
                        drop-shadow-2xl 
                        ${styles.menu}`}
                    >
                        <h2 className="whitespace-nowrap">Menu</h2>
                        <p>Subject to change. <b><a href="/#hours">See hours</a></b></p>
                        <h3>COFFEE</h3>
                        <MenuItem 
                            price="3.46"
                        >
                            Latte
                        </MenuItem>
                        <MenuItem
                            price="2.99"
                        >
                            Pumpkin Spice Latte
                        </MenuItem>
                        <MenuItem
                            price="3.99"
                        >
                            Drip Coffee
                        </MenuItem>

                        <MenuItem
                            price="3.99"
                        >
                            Mocha
                        </MenuItem>
                        <h3>SWEET TREATS</h3>
                        <MenuItem
                            description="yippee, yippee, yippee, apple cider slushie!"
                            price="1.99"
                        >
                            Apple Cider Slushie
                        </MenuItem>
                        <MenuItem
                            description="mmm yummy four donuts"
                            price="3.99"
                        >
                            Apple Cider Donut x 6
                        </MenuItem>
                        <MenuItem
                            description="mmm yummy six donuts"
                            price="5.99"
                        >
                            Apple Cider Donut x 12
                        </MenuItem>

                    </div>
                </div>
            </div>
        </Layout>
    )
}