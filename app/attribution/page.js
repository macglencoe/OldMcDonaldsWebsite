import Layout from "@/components/layout";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

const artists = [
  {
    usage: "Home: Fall Hero Banner",
    image: "https://images.unsplash.com/photo-1572978385565-b4c1c4b9ce17?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@partyintheshire?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Erica Marsland Huynh</a> on <a href="https://unsplash.com/photos/orange-pumpkins-hGeHVKkHJP0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
  },
  {
    usage: "Home: Winter Hero Banner",
    image: "https://images.unsplash.com/photo-1574457572226-7cc7ea7dd6c2?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/cabin-in-forest-with-snow-reab2UyAnxo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>`
  },
  {
    usage: "Home: Socials Backdrop",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@timothyhalesbennett?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Timothy Hales Bennett</a> on <a href="https://unsplash.com/photos/iphone-x-beside-macbook-OwvRB-M3GwE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Activities: Football Nets",
    image: "https://images.unsplash.com/photo-1566579090262-51cde5ebe92e?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@aussiedave?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Dave Adamson</a> on <a href="https://unsplash.com/photos/brown-wilson-american-football-on-grass-XXqNsborcjU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `,
    mustBeReplaced: true
  },
  {
    usage: "Activities: Playground",
    image: "https://images.unsplash.com/photo-1637062771078-eca465634238?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@mauricemaaktfotos?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Maurice DT</a> on <a href="https://unsplash.com/photos/a-park-with-a-swing-set-and-a-playground-in-the-background-Tb1NnBJv8b0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `,
    mustBeReplaced: true
  },
  {
    usage: "Activities: Corn Hole",
    image: "https://images.unsplash.com/photo-1636483022717-3eeaa9ff1a4f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@stevelieman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Steve Lieman</a> on <a href="https://unsplash.com/photos/two-women-playing-a-game-of-bean-bag-toss-2fH5WKaIg1k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Corn Maze: Night Maze",
    image: "https://images.unsplash.com/photo-1603174378108-63103ad2f24b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@eysteve?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Steven Aguilar</a> on <a href="https://unsplash.com/photos/brown-wooden-house-with-string-lights-during-night-time-cxV3TgLi7AA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `,
    mustBeReplaced: true
  },
  {
    usage: "Hayrides: Hayrides at night",
    image: "https://images.unsplash.com/photo-1707755939969-e9c1da71c5bb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@abalashevsky?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Artem Balashevsky</a> on <a href="https://unsplash.com/photos/the-night-sky-with-stars-and-trees-in-the-foreground-lkVKA9VpQ1o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Nature Trails: Things to keep in mind",
    image: "https://images.unsplash.com/photo-1653704597093-5d384b53cecc?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@billow926?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">billow926</a> on <a href="https://unsplash.com/photos/a-large-group-of-trees-in-a-grassy-area-g6r47yehJJc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Night Maze: October nth",
    image: "https://images.unsplash.com/photo-1719254866686-43d6dfd08b5b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@acdelevaux?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alejandro Cisneros Delevaux</a> on <a href="https://unsplash.com/photos/a-full-moon-is-seen-through-the-trees-AxemWwo_9x0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Night Maze: Includes",
    image: "https://images.unsplash.com/photo-1520857622823-2df34928e183?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@jasonedwa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jason  Edwards</a> on <a href="https://unsplash.com/photos/green-freight-truck-on-land-during-night-SH5AC4ATqZQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },
  {
    usage: "Petting Zoo: Thomas the Turkey & Nervous Nelly Placeholder",
    image: "https://images.unsplash.com/photo-1650119097921-53bb715fea34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@upnorth52?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">James Ertl</a> on <a href="https://unsplash.com/photos/a-couple-of-turkeys-standing-next-to-each-other-HnQhbL8WdK4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `,
      mustBeReplaced: true
  },
  {
    usage: "Pumpkin Patch: Transportation",
    image: "https://images.unsplash.com/photo-1740578266454-eee1d51fe7ff?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    credit: `Photo by <a href="https://unsplash.com/@abushihabmarey?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Mohamed Marey</a> on <a href="https://unsplash.com/photos/a-green-wagon-sitting-on-top-of-a-dirt-field-Qwi-aqCJrzI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      `
  },

]

export default function Attribution() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-8 text-center border-b border-gray-200" style={{
        backgroundImage: "linear-gradient(to top, var(--foreground) -200%, transparent 20%)",
      }}>
        <h1 className="font-[Satisfy] text-6xl font-extrabold text-gray-900 tracking-tight">Attribution</h1>
        <span className="text-lg text-gray-500 mt-2 block">Credit where credit is due</span>
      </div>

      <div className={`max-w-3xl mx-auto px-6 py-12 ` + " " + styles.body}>
        <p className="text-2xl mb-6">
          We're still working on procuring in-season photographs of the farm.
        </p>
        <p className="mb-6">This website is new, and we haven't had the chance to photograph the festival in full swing yet.</p >
        <p className="text-2xl mb-6">
          So, until then, we use stock and placeholder images provided by talented contributors on{" "}
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
            className="flex flex-col-reverse md:flex-row gap-2 justify-between items-center bg-white border border-gray-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow list-none"
          >
            <div className="p-3 flex flex-col gap-1 border-t-2 md:border-0 border-gray-200 w-full">
              <div className="text-xl font-medium text-gray-900 mb-1">{artist.usage}</div>
              <div
                className="text-gray-600 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: artist.credit }}
              />
              {
                artist.mustBeReplaced &&
                <div className="py-2 px-4 bg-red-600 w-fit rounded-lg text-white text-sm">
                  <strong>Must be replaced before launch</strong>
                </div>
              }
            </div>
            { 
              artist.image &&
              <Link href={artist.image}>
                <Image
                  src={artist.image}
                  alt={artist.usage}
                  height={100}
                  width={100}
                  className="h-25 w-xl md:w-25 object-cover rounded-lg"
                />
              </Link>
            }
          </li>
          
          
          
          ))}
        </ul>
      </div>
    </Layout>
  )
}
