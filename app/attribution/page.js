import Layout from "@/components/layout";
import styles from "./page.module.css";

const artists = [
    {
        usage: "Home page Fall Hero Banner",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@partyintheshire?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Erica Marsland Huynh</a> on <a href="https://unsplash.com/photos/orange-pumpkins-hGeHVKkHJP0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Home page Winter Hero Banner",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/cabin-in-forest-with-snow-reab2UyAnxo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Home page Rates section backdrop",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@anniespratt?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Annie Spratt</a> on <a href="https://unsplash.com/photos/a-field-of-tall-grass-with-trees-in-the-background-05DqzjHDeD8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
    },
    {
        usage: "Old McDonuts Placeholder",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@kylenieber?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Kyle Nieber</a> on <a href="https://unsplash.com/photos/a-group-of-people-standing-around-a-food-truck-iaE9xiao7wc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Doggystyle Placeholder",
        image: "",
        credit: `Photo by <a href="https://unsplash.com/@joana_g?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Joana Godinho</a> on <a href="https://unsplash.com/photos/woman-in-brown-coat-standing-in-front-of-food-stall-Gwv-t9VQiPM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Maze Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@hdbernd?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Bernd 📷 Dittrich</a> on <a href="https://unsplash.com/photos/an-aerial-view-of-a-field-with-a-house-in-the-middle-of-it-QWtyUsmV9Pg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "10 Acres of fun",
        credit: `Photo by <a href="https://unsplash.com/@miharekar?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Miha Rekar</a> on <a href="https://unsplash.com/photos/aerial-view-of-green-and-brown-trees-SrmVo6RxrQM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Night Maze",
        credit: `Photo by <a href="https://unsplash.com/@eysteve?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Steven Aguilar</a> on <a href="https://unsplash.com/photos/brown-wooden-house-with-string-lights-during-night-time-cxV3TgLi7AA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Cut your own",
        credit: `Photo by <a href="https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Markus Spiske</a> on <a href="https://unsplash.com/photos/blue-and-silver-pliers-on-black-and-gray-surface-eKmwptiw_3o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Grab a vase too!",
        credit: `Photo by <a href="https://unsplash.com/@lilybubbletea?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lily Morello</a> on <a href="https://unsplash.com/photos/a-vase-with-yellow-flowers-NsyOJJO_i8A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "A tour of the farm",
        credit: `Photo by <a href="https://unsplash.com/@slotosch?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andreas Slotosch</a> on <a href="https://unsplash.com/photos/a-green-hillside-with-houses-and-trees-in-the-distance-YsIPml6_jno?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayride Pricing",
        credit: `Photo by <a href="https://unsplash.com/@chamomileboi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Grant L</a> on <a href="https://unsplash.com/photos/brown-wooden-house-on-green-grass-field-during-daytime-h_mXQ1abmoo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "When to get on",
        credit: `Photo by <a href="https://unsplash.com/@randyfath?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Randy Fath</a> on <a href="https://unsplash.com/photos/children-riding-carriage-JRcRl8AvLYY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Hayrides at night",
        credit: `Photo by <a href="https://unsplash.com/@abalashevsky?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Artem Balashevsky</a> on <a href="https://unsplash.com/photos/the-night-sky-with-stars-and-trees-in-the-foreground-lkVKA9VpQ1o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Take a hike!",
        credit: `Photo by <a href="https://unsplash.com/@loomydoons?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Myles Bloomfield</a> on <a href="https://unsplash.com/photos/a-dirt-path-through-a-forest-xeTAoNgmVEE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "How do I get there?",
        credit: `Photo by <a href="https://unsplash.com/@nimamot?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nima Motaghian Nejad</a> on <a href="https://unsplash.com/photos/a-group-of-trees-sitting-on-top-of-a-lush-green-hillside-8773cr-8Nek?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Things to keep in mind",
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
        usage: "George the Llama Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@hristinash?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Hristina Šatalova</a> on <a href="https://unsplash.com/photos/brown-llama-on-green-grass-field-under-blue-and-white-sunny-cloudy-sky-during-daytime-2243El2t3Yw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Thomas the Turkey & Nervous Nelly Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@upnorth52?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">James Ertl</a> on <a href="https://unsplash.com/photos/a-couple-of-turkeys-standing-next-to-each-other-HnQhbL8WdK4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Gomez & Fester Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@rigels?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">rigel</a> on <a href="https://unsplash.com/photos/peacock-standing-on-brown-wood-bar-g0q4rAG_aEs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Grace & Frankie Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@iqsphotography?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jim</a> on <a href="https://unsplash.com/photos/a-group-of-sheep-standing-on-top-of-a-lush-green-field-pHVoJr9RTbA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Cinnamon & Nutmeg Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@mutecevvil?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ahmed</a> on <a href="https://unsplash.com/photos/a-herd-of-goats-standing-on-top-of-a-lush-green-field-sBiz3qAmxwY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Pugsley Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@seannyyyee?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sean Nyatsine</a> on <a href="https://unsplash.com/photos/brown-cow-on-green-grass-field-during-daytime-H6cPEhzA7Ig?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Rongo & Maui Placeholder",
        credit: `Photo by <a href="https://unsplash.com/@sebbiedesigns?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sebastian Abbruzzese</a> on <a href="https://unsplash.com/photos/two-white-and-black-piglets-in-front-of-wood-log-j5eImzQoedw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
    },
    {
        usage: "Pumpkin Patch: Pricing",
        credit: `Photo by <a href="https://unsplash.com/@rscupramedia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Rhys S</a> on <a href="https://unsplash.com/photos/a-field-full-of-oranges-with-a-tree-in-the-background-uRGOxpj2CBw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
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
            <div className="header">
                <h1>Attribution</h1>
                <span>Credit where credit is due</span>
            </div>
            <div className={styles.body + " body basic"}>
                <p>Throughout our website, we use stock and placeholder images provided by talented contributors on <a href="https://unsplash.com/">Unsplash</a>.</p>
                <p>These images are freely available under <a href="https://unsplash.com/license">Unsplash’s license</a>, which allows both personal and commercial use.</p>
                <p>We gratefully acknowledge and thank the artists who share their work, providing the internet with a wealth of fantastic visuals.</p>

                <h2>Artists</h2>
                <ul>
                    {artists.map((artist) => {
                        return (
                            <li>
                                <b>{artist.usage}</b> - <span dangerouslySetInnerHTML={{ __html: artist.credit }}></span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </Layout>
    )
}