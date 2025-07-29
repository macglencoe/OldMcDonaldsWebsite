import { AndImage } from "@/components/andImage";
import { BodyBlock } from "@/components/bodyBlock";
import Layout from "@/components/layout";
import styles from "./page.module.css";
import Link from "next/link";

function Generations() {
    const generations = [
        {
            id: "gen1",
            title: "Young McDonalds",
            people: [
                {
                    name: "Liam 'Paul' McDonald",
                    birthDeath: "2003 - Present",
                },
                {
                    name: "Reece McDonald",
                    birthDeath: "2002 - Present",
                },
                {
                    name: "Alaina McDonald",
                    birthDeath: "1996 - Present",
                },
                {
                    name: "Theodore McDonald",
                    birthDeath: "1993 - Present",
                }
            ],
            images: [
                {
                    srcs: [
                        "/liam-zoey-porch.jpg"
                    ],
                    caption: "Liam McDonald and dog Zoey on the porch at Glencoe Farm, 2003"
                }
            ]
        },
        {
            id: "gen2",
            title: "Middle-Age McDonalds",
            people: [
                {
                    name: "Charles 'Charlie Bill' McDonald",
                    birthDeath: "1964 - 2024",
                },
                {
                    name: "Stephanie Nesselrodt McDonald",
                    birthDeath: "1974 - Present",
                }
            ],
            images: [
                {
                    srcs: [
                        "/charliebill1.png"
                    ],
                    caption: "Charles 'Charlie Bill' McDonald, circa 1967"
                },
                {
                    srcs: [
                        "/reunion1.jpg",
                        "/reunion2.jpg",
                        "/reunion3.jpg",
                    ],
                    caption: "Annual McDonald Family Reunion at Glencoe Farm"
                },
            ]
        },
        {
            id: "gen3",
            title: "Old McDonalds",
            people: [
                {
                    name: "Charles 'Bub' Francis Wall McDonald",
                    birthDeath: "1927 - 2024",
                },
                {
                    name: "Willa Jean Hammersla McDonald",
                    birthDeath: "1929 - 1998"
                }
            ],
            images: [
                {
                    srcs: [
                        "/bub-willa-gail-kathy.png"
                    ],
                    caption: "Charles 'Bub' McDonald (right) and Willa Jean Hammersla McDonald (left) with daughters Gail McDonald Fidelman (right) and Kathy (left), circa 1950s"
                },
                {
                    srcs: [
                        "/willa-jean-child.jpg"
                    ],
                    caption: "Willa Jean Hammersla, circa 1930s"
                },
                {
                    srcs: [
                        "/mfm-moline.png"
                    ],
                    caption: "Charles 'Bub' McDonald (middle) receiving a tractor for McDonald Farm Machinery, 1950"
                },
                {
                    srcs: [
                        "/mag-bub-and-peggy.png"
                    ],
                    caption: '"Grandma Mag" (right) with grandchildren Charles "Bub" McDonald (left) and Peggy McDonald (center)'
                },
                {
                    srcs: [
                        "/bubAndPeggy.jpg",
                        "/bubAndPeggy2.png"
                    ],
                    caption: 'Peggy (left) and Charles "Bub" McDonald (right),  1929-1931'
                },
                {
                    srcs: [
                        "/limousin1.jpg",
                        "/limousin2.jpg"
                    ],
                    caption: "Limousin Cattle at Glencoe Farm"
                }
            ]
        },
        {
            id: "gen4",
            title: "Old Old McDonalds",
            people: [
                {
                    name: "Theodore Roosevelt McDonald",
                    birthDeath: "1902 - 1973",
                },
                {
                    name: "Elizabeth Wall McDonald",
                    birthDeath: "1900 - 1929"
                }
            ],
            images: [
                {
                    srcs: [
                        "/barnunknown.png",
                        "/barnunknown2.png",
                    ],
                    caption: "Unknown folks pictured in front of the big white barn at Glencoe Farm, circa 1910"
                },
                {
                    srcs: [
                        "/hay-stack.jpg"
                    ],
                    caption: "Straw stack in the barnyard at Glencoe Farm"
                },
                {
                    srcs: [
                        "/richard-mcdonald-glencoe.jpg"
                    ],
                    caption: "Richard Clyde McDonald (brother of Theodore Roosevelt McDonald) pictured in front of the workshop at Glencoe Farm"
                },
                {
                    srcs: [
                        "/daddy-ted.png"
                    ],
                    caption: "Theodore Roosevelt McDonald"
                }
            ]
        },
        {
            id: "gen5",
            title: "Old Old Old McDonalds",
            people: [
                {
                    name: "Ernest Faulkner McDonald",
                    birthDeath: "1874 - 1947",
                },
                {
                    name: "Lily Margaret 'Grandma Mag' Borum McDonald",
                    birthDeath: "1874 - 1962"
                }
            ],
            images: [
                {
                    srcs: [
                        "/ernest-young.png"
                    ],
                    caption: "Young Ernest Faulkner McDonald"
                },
                {
                    srcs: [
                        "/mcdonaldporch.jpg"
                    ],
                    caption: "McDonald Family gathered on the side porch at Glencoe Farm in 1929. Ernest Faulkner McDonald is pictured on the left"
                },
                {
                    srcs: [
                        "/ernest-mag-porch.jpg"
                    ],
                    caption: '"Grandma Mag" (center), Elizabeth (center left) holding daughter Peggy, and Ernest Faulkner McDonald (center right)<br/>on the porch at Glencoe Farm in 1926'
                },
                {
                    srcs: [
                        "/ernest-cherry.png"
                    ],
                    caption: 'Ernest Faulkner McDonald pictured with a cherry tree on the "hill field" at Glencoe Farm'
                },
                {
                    srcs: [
                        "/mag-late-years.jpg"
                    ],
                    caption: 'Margaret "Grandma Mag" Borum McDonald in her late years'
                }
            ]
        },
        {
            id: "gen6",
            title: "Old Old Old Old McDonalds",
            people: [
                {
                    name: "James William McDonald",
                    birthDeath: "1837 - 1911"
                },
                {
                    name: "Alice Mae Stewart McDonald",
                    birthDeath: "1855 - 1926"
                }
            ],
            images: [
                {
                    srcs: [
                        "/james-w-mcdonald-choral-society.jpg"
                    ],
                    caption: "The Choral Society, with James William McDonald pictured as tallest (center-right, back row)"
                },
                {
                    srcs: [
                        "/alice-stewart-mcdonald.jpg"
                    ],
                    caption: "Alice Mae Stewart McDonald"
                }
            ]
        },
        {
            id: "gen7",
            title: "Old Old Old Old Old McDonalds",
            people: [
                {
                    name: "William McDonald",
                    birthDeath: "1790 - 1856"
                },
                {
                    name: "Margaret Evans Van Metre McDonald",
                    birthDeath: "1798 - 1874"
                }
            ],
            images: [
                {
                    srcs: [
                        "/deed.jpg"
                    ],
                    caption: "18th century survey plat for the tract of land purchased by William McDonald, intended to be used as a homeplace for his mother. This parcel is now known as Glencoe Farm"
                }
            ]
        },
        {
            id: "gen8",
            title: "Old Old Old Old Old Old McDonalds",
            people: [
                {
                    name: "James McDonald",
                    birthDeath: "1752 - 1830"
                },
                {
                    name: "Isabella Burns McDonald",
                    birthDeath: "1766 - 1840"
                }
            ]
        },
        {
            id: "gen9",
            title: "Old Old Old Old Old Old Old McDonalds",
            people: [
                {
                    name: "Andrew MacDonald",
                    birthDeath: "1724 - 1799"
                },
                {
                    name: "Hester MacDonald",
                    birthDeath: "1730 - 1808"
                }
            ]
        },
        {
            id: "gen10",
            title: "Old Old Old Old Old Old Old Old McDonalds",
            people: [
                {
                    name: "Donald Roy MacDonald",
                    birthDeath: "1700 - 1749"
                }, 
                {
                    name: "Jean MacLeod MacDonald",
                    birthDeath: "1703 - unknown"
                }
            ]
        },
        {
            id: "gen11",
            title: "Old Old Old Old Old Old Old Old Old McDonalds",
            people: [
                {
                    name: "Dougall MacDonald",
                    birthDeath: "1680 - unknown"
                },
                {
                    name: "Christan Robertson MacDonald",
                    birthDeath: "1680 - 1706"
                },
            ]
        },
        {
            id: "gen12",
            title: "Eldest McDonalds",
            people: [
                {
                    name: "Somairle mac Gilla Brigte",
                    title: "King of the Isles",
                    birthDeath: "unknown - 1164 AD"
                },
                {
                    name: "Ragnhildr Óláfsdóttir",
                    title: "Queen of the Isles, Princess of Man",
                    birthDeath: "est. 1115 AD - unknown"
                }
            ]
        }
    ]

    return (
        <div>
            <h2 className="text-center mb-5">McDonald Geneology</h2>
            { generations.map((generation) => (
                <div key={generation.id} className="flex flex-col gap-8 mb-14 border-x-9 border-y-transparent border-y-9 border-double border-foreground/20 px-2">
                    <h3 className="!text-4xl text-center" >{generation.title}</h3>
                    <div className="flex flex-row flex-wrap gap-4 text-center justify-evenly" style={{
                        fontFamily: "Inter",
                    }}>
                        { generation.people.map((person) => (
                            <div className="flex flex-col border-y-6 border-x-transparent border-x-6 border-double p-2 " key={person.name}>
                                <div className="font-bold">{person.name}</div>
                                <div className="text-sm">{person.birthDeath}</div>
                            </div>
                        )) }
                    </div>
                    { generation.images &&
                        <div className={styles.gallery} style={{
                        fontFamily: "Inter"
                    }}>
                        { generation.images.map((image) => (
                            <div key={image.srcs[0]}>
                                {image.srcs.map((src) => (
                                    <img key={src} src={src} />
                                ))}
                                <p>{image.caption}</p>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            ))}
        </div>
    )
}


export default function About() {
    
    return (
        <Layout>
            <div className="header">
                <h1>About Us</h1>
                <span>The Story of Glencoe Farm</span>
            </div>
            <div className="body basic">
                <BodyBlock src="localMap.png">
                    <h2>Our Farm</h2>
                    <p>We're a family-owned (and operated) farm in <b>Berkeley County, West Virginia</b>, right off Interstate 81.</p>
                    <p>With Middle Creek running through our park-like grounds, our farm is the perfect place to spend some quality time with your family or friends!</p>
                    <p>Six weekends each fall, we open our farm to the community for various festival <Link href="/activities">activities</Link>.</p>
                    <p>It is a labor of love to spend the year preparing for the season, and we're dedicated to bringing you and your family the best farm experience. We feel blessed to be able to share our home place with you!</p>
                </BodyBlock>
                <BodyBlock src="macdonaldOfGlencoe.jpg">
                    <h2 className="md:!text-5xl">Yes, we're really <u>McDonalds</u></h2>
                    <p>Or <b><i>Mac</i>Donalds</b>, originally.</p>
                    <p>In the early 1700s, a man named <b>Andrew MacDonald</b> immigrated from <b>Glencoe, Scotland</b> to <b>Arden, Virginia (now West Virginia)</b>.</p>
                    <p>Seven generations later, we carry on the traditions of <a href="https://en.wikipedia.org/wiki/Clan_MacDonald_of_Glencoe" className="!break-normal" target="_blank"><b>Clan MacDonald of Glencoe (Clann Iain Abrach)</b></a>. Take that, King William!</p>
                </BodyBlock>
                <BodyBlock src="westwing.jpg">
                    <h2>And yes, we're really <u>old</u></h2>
                    <p>In 2021, Glencoe Farm had the honor of receiving the <a href="https://www.wvca.us/education/century_farms.cfm" target="_blank" className="!break-normal"><b>Sestercentennial Farm Award</b></a>. That means our farm has been in continuous operation for 250 years!</p>
                </BodyBlock>
                <BodyBlock>
                    <h2>Throughout the years,</h2>
                    <p>Our farm has been home to many different ventures over the decades.</p>
                    <p>From the late 1800s to the 1950s, we played a role in <a href="https://www.journal-news.net/journal-news/long-and-short-of-it-berkeley-countys-apple-industry-discussion-to-be-held/article_34739292-a1ba-5b92-a050-0757d0ce868e.html" target="_blank" className="!break-normal">Berkeley County's thriving Apple Industry</a>.<br/>
                    Our great-grandfather, Ernest Faulkner McDonald, was one of the original 18 guarantors of the C.H. Musselman Company Apple Plant in Inwood.</p>
                    <p>In the 1950s, our grandfather, Charles "Bub" Francis Wall McDonald founded McDonald Farm Machinery - West Virginia's first John Deere dealership - and operated it until 1985.</p>
                    <p>In 2001, our father, Charles "Charlie Bill" William McDonald, together with his wife Stephanie, planted corn and pumpkins on the farm for the first time, and established Old McDonald's Pumpkin Patch.</p>
                </BodyBlock>

                <Generations />

                
                <BodyBlock src="protectedForever.jpg">
                    <h2>Protected Forever</h2>
                    <p>In 2007, Glencoe Farm was accepted into the <a href="https://landtrustalliance.org/land-trusts/explore/berkeley-county-farmland-protection-board-wv" target="_blank" className="!break-normal">Berkeley County Farm Preservation Land Trust.</a></p>
                    <p>We are very proud to be a part of this union, which ensures that this land will be conserved for generations to come.</p>
                </BodyBlock>
            </div>
        </Layout>
    );
}