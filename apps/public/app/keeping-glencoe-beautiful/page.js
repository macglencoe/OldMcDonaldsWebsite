import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import styles from "./page.module.css";

export const metadata = {
    title: "Keeping Glencoe Beautiful",
    description: "Learn how Glencoe Farm protects 161 acres of West Virginia farmland through conservation, careful soil management, wildlife habitat, and responsible farming.",
};

const stewardshipPractices = [
    {
        number: "01",
        title: "Crop rotation",
        description: "Pumpkins, corn, and alfalfa are rotated so the same crop does not make the same demands on a field year after year.",
    },
    {
        number: "02",
        title: "Cover crops",
        description: "Rye protects fields between primary crops, keeping living roots in the soil during the off-season.",
    },
    {
        number: "03",
        title: "No-till planting",
        description: "Planting with minimal soil disturbance helps protect soil structure and reduces the risk of erosion.",
    },
    {
        number: "04",
        title: "Soil testing",
        description: "Regular testing helps us understand what each field needs before we add nutrients or make a planting decision.",
    },
    {
        number: "07",
        title: "Erosion control",
        description: "We adapt how we use the fields when flooding or runoff shows us that the land needs time and help to recover.",
    },
];

const wildlife = [
    "White-tailed deer",
    "Gray and red foxes",
    "Wild turkeys",
    "Barn owls",
    "Eastern box turtles",
    "Opossums",
    "Raccoons",
    "Smallmouth bass",
    "Occasional coyotes",
    "Occasional black bears",
];

export default function KeepingGlencoeBeautiful() {
    return (
        <Layout>
            <main className={styles.page}>
                <section className={styles.hero}>
                    <Image
                        src="/hillview.jpg"
                        alt="A wide summer view across the fields, pond, and wooded hills of Glencoe Farm"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroShade} />
                    <div className={styles.heroContent}>
                        <p className={styles.eyebrow}>Keeping Glencoe Beautiful</p>
                        <h1>Protected Forever</h1>
                        <p className={styles.heroLead}>
                            A 250 year old working farm, cared for with the next 250 years in mind.
                        </p>
                        <a className={styles.heroLink} href="#our-promise">
                            Read our stewardship story
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </section>

                <section className={styles.facts} aria-label="Glencoe Farm conservation facts">
                    <div>
                        <strong>161</strong>
                        <span>acres protected</span>
                    </div>
                    <div>
                        <strong>2007</strong>
                        <span>easement established</span>
                    </div>
                    <div>
                        <strong>12.27</strong>
                        <span>wild acres</span>
                    </div>
                    <div>
                        <strong>250+</strong>
                        <span>years of family farming</span>
                    </div>
                </section>

                <section className={styles.promise} id="our-promise">
                    <div className={styles.promiseImage}>
                        <Image
                            src="/protectedForever.jpg"
                            alt="A Glencoe Farm corn maze cut with the words This Land Is Protected Forever"
                            fill
                            sizes="(max-width: 800px) 100vw, 48vw"
                        />
                    </div>
                    <div className={styles.promiseContent}>
                        <p className={styles.sectionLabel}>A choice that outlives us</p>
                        <h2>Why we chose preservation</h2>
                        <p className={styles.lead}>
                            As development spread through the Inwood area, our family wanted to ensure that Glencoe would always remain farmland.
                        </p>
                        <p>
                            On August 17, 2007, a permanent conservation easement was placed on 161 acres of Glencoe Farm. The easement is held by the Berkeley County Farmland Protection Board and protects every part of the farm except the existing visitor parking area.
                        </p>
                        <p>
                            The land is still privately owned and actively farmed, but its future no longer depends on the next development proposal. Glencoe can remain agricultural, open, and rooted in its history for generations to come.
                        </p>
                        <a
                            className={styles.textLink}
                            href="https://wvfp.org/berkeley/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Learn about farmland protection in Berkeley County
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </section>

                <section className={styles.legacy}>
                    <div className={styles.legacyCopy}>
                        <p className={styles.sectionLabel}>Charlie Bill&apos;s legacy</p>
                        <h2>One lifetime of stewardship. Four children carrying it forward.</h2>
                        <blockquote>
                            <p>
                                For Charlie &ldquo;Charlie Bill&rdquo; McDonald, caring for Glencoe was never simply a job. From the day he was born, the farm was part of his life and purpose.
                            </p>
                        </blockquote>
                        <p>
                            He made it his life&apos;s mission to take care of this place. He did right by the land, and he raised four children who are just as dedicated to protecting it, working it, and sharing it with their community.
                        </p>
                    </div>
                    <figure className={styles.photoPlaceholder}>
                        <div aria-hidden="true">
                            <strong>Charlie Bill Placeholder</strong>
                        </div>
                        <figcaption>
                            Charles &ldquo;Charlie Bill&rdquo; William McDonald
                        </figcaption>
                    </figure>
                </section>

                <section className={styles.soil} id="soil">
                    <header className={styles.sectionHeader}>
                        <p className={styles.sectionLabel}>How we keep our promise</p>
                        <h2>Caring for the soil</h2>
                        <p>
                            Conservation happens through ordinary decisions made season after season. These are some of the ways we keep Glencoe&apos;s working land healthy.
                        </p>
                    </header>

                    <div className={styles.practiceGrid}>
                        {stewardshipPractices.map((practice) => (
                            <article className={styles.practiceCard} key={practice.title}>
                                <span>{practice.number}</span>
                                <h3>{practice.title}</h3>
                                <p>{practice.description}</p>
                            </article>
                        ))}
                    </div>  
                </section>

                <section className={styles.nature} id="nature-maze">
                    <div className={styles.natureImage}>
                        <Image
                            src="/walnutbottom.jpg"
                            alt="Sunlight filtering through the wild woods of Glencoe Farm"
                            fill
                            sizes="(max-width: 900px) 100vw, 52vw"
                        />
                    </div>
                    <div className={styles.natureCopy}>
                        <p className={styles.sectionLabel}>Room to remain wild</p>
                        <h2>The Nature Maze</h2>
                        <p className={styles.lead}>
                            More than 12 acres are left completely wild, except for the trails that invite visitors into the woods.
                        </p>
                        <p>
                            The Nature Maze gives animals a place to feed, shelter, and move through the farm. Some are everyday neighbors; others only pass through when we are lucky.
                        </p>
                        <ul className={styles.wildlifeList}>
                            {wildlife.map((animal) => (
                                <li key={animal}>{animal}</li>
                            ))}
                        </ul>
                        <Link className={styles.textLink} href="/activities/nature-trails">
                            Plan a walk through the Nature Maze
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </section>

                <section className={styles.smallStories}>
                    <article className={styles.pollinatorStory}>
                        <div className={styles.storyImage}>
                            <Image
                                src="/anemone.jpg"
                                alt="A red flower growing among the grass at Glencoe Farm"
                                fill
                                sizes="(max-width: 800px) 100vw, 34vw"
                            />
                        </div>
                        <div>
                            <p className={styles.sectionLabel}>Pollinators at work</p>
                            <h2>A home for bees</h2>
                            <p>
                                A local beekeeper maintains hives in our pollinator areas. The bees find food among the alfalfa and wildflowers while helping those plants flourish.
                            </p>
                        </div>
                    </article>

                    <article className={styles.harvestStory}>
                        <p className={styles.sectionLabel}>The harvest continues</p>
                        <h2>What we grow stays part of the farm</h2>
                        <div className={styles.harvestCycle}>
                            <div>
                                <strong>Maze corn</strong>
                                <span aria-hidden="true">→</span>
                                <p>Ground and mixed into feed for the farm&apos;s animals</p>
                            </div>
                            <div>
                                <strong>Leftover pumpkins</strong>
                                <span aria-hidden="true">→</span>
                                <p>A seasonal treat for the cows and pigs</p>
                            </div>
                        </div>
                    </article>
                </section>

                

                <section className={styles.invitation} id="explore">
                    <div className={styles.invitationBackdrop} />
                    <div className={styles.invitationContent}>
                        <p className={styles.sectionLabel}>Protected does not mean closed</p>
                        <h2>The farm is yours to explore</h2>
                        <p>
                            While we&apos;re open, Glencoe is more than a place to complete a list of activities. Bring a picnic. Walk the trails. Explore the farm. Sit beside the creek and stay awhile.
                        </p>
                        <p className={styles.leaveNoTrace}>
                            Treat it like a park: respect the land and leave no trace.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/map">Open the farm map</Link>
                            <Link href="/activities/nature-trails">Explore the Nature Maze</Link>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
