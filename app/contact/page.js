import Layout from "@/components/layout";
import PageHeader from "@/components/pageHeader";
import ContactForm from "@/components/contactForm";

export const metadata = {
    title: "Contact Us",
    description:
        "Get in touch with Old McDonald’s Pumpkin Patch & Corn Maze in Inwood, WV. Find our address, hours, and send us a message.",
};

export default function Contact() {
    return (
        <Layout>
            <PageHeader subtitle="We’d love to hear from you">Contact Us</PageHeader>

            <div className="body basic">
                <section>
                    <div className="grid gap-6 md:grid-cols-2 mt-8">
                        <div className="rounded-xl border border-foreground/10 overflow-hidden">
                            <div
                                className="p-6 bg-[url('/entrance.jpg')] bg-cover bg-center relative"
                                aria-hidden
                            >
                                <div className="absolute inset-0 standard-backdrop rounded-t-xl" />
                                <div className="relative z-10 text-background">
                                    <h3 className="text-3xl font-satisfy mb-2">Old McDonald’s Pumpkin Patch</h3>
                                    <p className="opacity-90">Glencoe Farm, Inwood, WV</p>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <div className="font-semibold">Mailing Address</div>
                                    <p>
                                        1597 Arden Nollville Rd
                                        <br />
                                        Inwood, WV 25428
                                    </p>
                                </div>
                                <div>
                                    <div className="font-semibold">Phone</div>
                                    <a href="tel:+13048392330">+1 304 839 2330</a>
                                </div>
                                <div>
                                    <div className="font-semibold">Email (Business Inquiries)</div>
                                    <a href="mailto:oldmcdonaldsglencoefarm@gmail.com">oldmcdonaldsglencoefarm@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-foreground/10 overflow-hidden min-h-64">
                            <iframe
                                title="Map to Old McDonald’s Pumpkin Patch"
                                className="w-full h-full min-h-64"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.314756569123!2d-78.04480392349423!3d39.3858425716188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c10301e71eed7b%3A0x4d0d869ee11addca!2sOld%20McDonald%E2%80%99s%20Pumpkin%20Patch%20%26%20Corn%20Maze!5e0!3m2!1sen!2sus!4v1726050000000"
                            />
                        </div>
                    </div>
                </section>

                <section className="mt-2">
                    <div className="rounded-2xl overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[url('/brookbridge.jpg')] bg-cover bg-center" />
                            <div className="absolute inset-0" />
                            <div className="relative flex justify-center standard-backdrop">
                                <ContactForm theme="onDark" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
