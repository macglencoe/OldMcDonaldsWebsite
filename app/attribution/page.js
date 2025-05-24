import Layout from "@/components/layout";
import styles from "./page.module.css";

const artists = [
    {
        usage: "Home: Fall Hero Banner",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@partyintheshire?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Erica Marsland Huynh</a> on <a href="https://unsplash.com/photos/orange-pumpkins-hGeHVKkHJP0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Home: Winter Hero Banner",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/cabin-in-forest-with-snow-reab2UyAnxo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Home: Rates section backdrop",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@anniespratt?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Annie Spratt</a> on <a href="https://unsplash.com/photos/a-field-of-tall-grass-with-trees-in-the-background-05DqzjHDeD8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Vendors: Old McDonuts Placeholder",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@kylenieber?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Kyle Nieber</a> on <a href="https://unsplash.com/photos/a-group-of-people-standing-around-a-food-truck-iaE9xiao7wc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Vendors: Doggystyle Placeholder",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@joana_g?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joana Godinho</a> on <a href="https://unsplash.com/photos/woman-in-brown-coat-standing-in-front-of-food-stall-Gwv-t9VQiPM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Corn Maze: Maze Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@hdbernd?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Bernd 📷 Dittrich</a> on <a href="https://unsplash.com/photos/an-aerial-view-of-a-field-with-a-house-in-the-middle-of-it-QWtyUsmV9Pg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Corn Maze: 10 Acres of fun",
        credit: `Photo by <a href="https://unsplash.com/@miharekar?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Miha Rekar</a> on <a href="https://unsplash.com/photos/aerial-view-of-green-and-brown-trees-SrmVo6RxrQM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Corn Maze: Night Maze",
        credit: `Photo by <a href="https://unsplash.com/@eysteve?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Steven Aguilar</a> on <a href="https://unsplash.com/photos/brown-wooden-house-with-string-lights-during-night-time-cxV3TgLi7AA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Flowers: Cut your own",
        credit: `Photo by <a href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Markus Spiske</a> on <a href="https://unsplash.com/photos/blue-and-silver-pliers-on-black-and-gray-surface-eKmwptiw_3o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Flowers: Grab a vase too!",
        credit: `Photo by <a href="https://unsplash.com/@lilybubbletea?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lily Morello</a> on <a href="https://unsplash.com/photos/a-vase-with-yellow-flowers-NsyOJJO_i8A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayrides: A tour of the farm",
        credit: `Photo by <a href="https://unsplash.com/@slotosch?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andreas Slotosch</a> on <a href="https://unsplash.com/photos/a-green-hillside-with-houses-and-trees-in-the-distance-YsIPml6_jno?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayrides: Pricing",
        credit: `Photo by <a href="https://unsplash.com/@chamomileboi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Grant L</a> on <a href="https://unsplash.com/photos/brown-wooden-house-on-green-grass-field-during-daytime-h_mXQ1abmoo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayrides: When to get on",
        credit: `Photo by <a href="https://unsplash.com/@randyfath?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Randy Fath</a> on <a href="https://unsplash.com/photos/children-riding-carriage-JRcRl8AvLYY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayrides: Hayrides at night",
        credit: `Photo by <a href="https://unsplash.com/@abalashevsky?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Artem Balashevsky</a> on <a href="https://unsplash.com/photos/the-night-sky-with-stars-and-trees-in-the-foreground-lkVKA9VpQ1o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Nature Trails: Take a hike!",
        credit: `Photo by <a href="https://unsplash.com/@loomydoons?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Myles Bloomfield</a> on <a href="https://unsplash.com/photos/a-dirt-path-through-a-forest-xeTAoNgmVEE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Nature Trails: How do I get there?",
        credit: `Photo by <a href="https://unsplash.com/@nimamot?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nima Motaghian Nejad</a> on <a href="https://unsplash.com/photos/a-group-of-trees-sitting-on-top-of-a-lush-green-hillside-8773cr-8Nek?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Nature Trails: Things to keep in mind",
        credit: `Photo by <a href="https://unsplash.com/@billow926?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">billow926</a> on <a href="https://unsplash.com/photos/a-large-group-of-trees-in-a-grassy-area-g6r47yehJJc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Night Maze: October nth",
        credit: `Photo by <a href="https://unsplash.com/@acdelevaux?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alejandro Cisneros Delevaux</a> on <a href="https://unsplash.com/photos/a-full-moon-is-seen-through-the-trees-AxemWwo_9x0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Night Maze: Pricing",
        credit: `Photo by <a href="https://unsplash.com/@jorisoi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joris Voeten</a> on <a href="https://unsplash.com/photos/people-gathered-around-camp-fire-at-nighttime-gL84ogFsV6s?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Night Maze: Includes",
        credit: `Photo by <a href="https://unsplash.com/@jasonedwa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jason  Edwards</a> on <a href="https://unsplash.com/photos/green-freight-truck-on-land-during-night-SH5AC4ATqZQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: George the Llama Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@hristinash?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Hristina Šatalova</a> on <a href="https://unsplash.com/photos/brown-llama-on-green-grass-field-under-blue-and-white-sunny-cloudy-sky-during-daytime-2243El2t3Yw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Thomas the Turkey & Nervous Nelly Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@upnorth52?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">James Ertl</a> on <a href="https://unsplash.com/photos/a-couple-of-turkeys-standing-next-to-each-other-HnQhbL8WdK4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Gomez & Fester Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@rigels?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">rigel</a> on <a href="https://unsplash.com/photos/peacock-standing-on-brown-wood-bar-g0q4rAG_aEs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Grace & Frankie Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@iqsphotography?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jim</a> on <a href="https://unsplash.com/photos/a-group-of-sheep-standing-on-top-of-a-lush-green-field-pHVoJr9RTbA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Cinnamon & Nutmeg Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@mutecevvil?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ahmed</a> on <a href="https://unsplash.com/photos/a-herd-of-goats-standing-on-top-of-a-lush-green-field-sBiz3qAmxwY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Pugsley Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@seannyyyee?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sean Nyatsine</a> on <a href="https://unsplash.com/photos/brown-cow-on-green-grass-field-during-daytime-H6cPEhzA7Ig?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Petting Zoo: Rongo & Maui Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@sebbiedesigns?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sebastian Abbruzzese</a> on <a href="https://unsplash.com/photos/two-white-and-black-piglets-in-front-of-wood-log-j5eImzQoedw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Pumpkin Patch: Transportation",
        credit: `Photo by <a href="https://unsplash.com/@abushihabmarey?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Mohamed Marey</a> on <a href="https://unsplash.com/photos/a-green-wagon-sitting-on-top-of-a-dirt-field-Qwi-aqCJrzI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Pumpkin Patch: Variety",
        credit: `Photo by <a href="https://unsplash.com/@nutsycoco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Melanie Hughes</a> on <a href="https://unsplash.com/photos/pumpkin-lot-JOqIPIjmUyQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    }
]

export default function Attribution() {
    return (
        <Layout>
            <div className="px-6 pt-12 pb-8 text-center border-b border-gray-200" style={{
                backgroundImage: "linear-gradient(to top, var(--accent) -200%, transparent 20%)",
            }}>
                <h1 className="font-[Satisfy] text-6xl font-extrabold text-gray-900 tracking-tight">Attribution</h1>
                <span className="text-lg text-gray-500 mt-2 block">Credit where credit is due</span>
            </div>

            <div className={`max-w-3xl mx-auto px-6 py-12 prose prose-lg prose-neutral` + " " + styles.body}>
                <p>
                    Throughout our website, we use stock and placeholder images provided by talented contributors on{" "}
                    <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">
                        Unsplash
                    </a>.
                </p>
                <p>
                    These images are freely available under{" "}
                    <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                        Unsplash’s license
                    </a>, which allows both personal and commercial use.
                </p>
                <p>
                    We gratefully acknowledge and thank the artists who share their work, providing the internet with a
                    wealth of fantastic visuals.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">Artists</h2>

                <ul className="space-y-6">
                    {artists.map((artist, i) => (
                        <li
                            key={i}
                            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow list-none"
                        >
                            <div className="text-xl font-medium text-gray-900 mb-1">{artist.usage}</div>
                            <div
                                className="text-gray-600 leading-relaxed text-sm"
                                dangerouslySetInnerHTML={{ __html: artist.credit }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}
