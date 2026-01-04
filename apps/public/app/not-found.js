import Layout from "@/components/layout";
import Image from "next/image";

export default function NotFound() {
    return (
        <Layout>
            <div className="p-4">
                <div className="w-full h-[90vh] relative p-4 overflow-hidden" style={{
                    backgroundImage: "url('/hillview.jpg')",
                    backgroundSize: "cover",
                }}>
                    <div className="p-5 h-full w-fit flex flex-col items-center justify-center gap-5 bg-foreground/50 relative shadow-2xl rounded-lg text-center">
                        <h1 className="text-7xl font-bold text-white">404</h1>
                        <h1 className="text-3xl font-bold text-white">Lost on the Farm</h1>
                        <p className="text-white">There's nothing to do out here</p>
                        <p><a href="/" className="text-background bg-accent/50 px-5 py-2 rounded-full hover:bg-accent">Go Home</a></p>
                        <p><a href="/contact#dev" className="text-background bg-foreground/50 px-5 py-2 rounded-full hover:bg-foreground">Contact Dev</a></p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
