import { AndImage } from "@/components/andImage";
import { BodyBlock } from "@/components/bodyBlock";
import Layout from "@/components/layout";
import styles from "./page.module.css";
import Link from "next/link";

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
                <div className={styles.gallery}>
                    <div>
                        <img src="/mcdonaldporch.jpg"></img>
                        <span>McDonald Family gathered on the side porch at Glencoe Farm, circa 1929. Ernest Faulkner McDonald is pictured on the left</span>
                    </div>
                    <div>
                        <img src="/bubAndPeggy.jpg"></img>
                        <span>Peggy (left) and Charles "Bub" McDonald (right), circa 1931</span>
                    </div>
                    <div>
                        <img src="/mfm-moline.png"></img>
                        <span>Charles "Bub" McDonald (middle) receiving a tractor for McDonald Farm Machinery, circa 1950</span>
                    </div>
                </div>
                <BodyBlock src="protectedForever.jpg">
                    <h2>Protected Forever</h2>
                    <p>In 2007, Glencoe Farm was accepted into the <a href="https://landtrustalliance.org/land-trusts/explore/berkeley-county-farmland-protection-board-wv" target="_blank" className="!break-normal">Berkeley County Farm Preservation Land Trust.</a></p>
                    <p>We are very proud to be a part of this union, which ensures that this land will be conserved for generations to come.</p>
                </BodyBlock>
            </div>
        </Layout>
    );
}