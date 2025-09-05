import Action from "@/components/action";
import Rates from "@/components/home/rates";
import Layout from "@/components/layout";


export default function Pricing() {
    return (
        <Layout>
            <Rates />
            <div className="bg-foreground p-3">
                <section className="max-w-5xl my-4 mx-auto flex flex-col items-center gap-3">
                    <h2 className="text-background font-satisfy text-5xl text-center my-4">Ready to come on down?</h2>
                    <Action as="a" href="/visit" variant="tertiary">Visit</Action>
                </section>
            </div>
        </Layout>
    )
}