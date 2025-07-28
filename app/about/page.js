import { AndImage } from "@/components/andImage";
import { BodyBlock } from "@/components/bodyBlock";
import Layout from "@/components/layout";
import Image from "next/image";
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

                <BodyBlock>
                    <h2>Old McDonald Geneology</h2>
                    <div className={styles.geneology}>
                        <h3>Young McDonalds</h3>
                        <ul>
                            <li>Liam 'Paul' McDonald <div><span>2003</span></div></li>
                            <li>Reece McDonald <div><span>2002</span></div></li>
                            <li>Alaina McDonald <div><span>1996</span></div></li>
                            <li>Theodore McDonald <div><span>1993</span></div></li>
                        </ul>
                        <h3>Middle-Age McDonald</h3>
                        <ul>
                            <li>Charles 'Charlie Bill' McDonald <div><span>1964 - 2024</span></div></li>
                            <li>Stephanie McDonald <div><span>1974</span></div></li>
                        </ul>
                        <h3>Old McDonald</h3>
                        <ul>
                            <li>Charles 'Bub' Francis Wall McDonald <div><span>1927 - 2024</span></div></li>
                            <li>Willa Jean Hammersla McDonald <div><span>1929 - 1998</span></div></li>
                        </ul>
                        <h3>Old Old McDonald</h3>
                        <ul>
                            <li>Theodore Roosevelt McDonald <div><span>1902 - 1973</span></div></li>
                            <li>Elizabeth Wall McDonald <div><span>1900 - 1929</span></div></li>
                        </ul>
                        <h3>Old Old Old McDonald</h3>
                        <ul>
                            <li>Ernest Faulkner McDonald <div><span>1874 - 1947</span></div></li>
                            <li>Lily Margaret 'Grandma Mag' Borum McDonald <div><span>1874 - 1962</span></div></li>
                        </ul>
                        <h3>Old Old Old Old McDonald</h3>
                        <ul>
                            <li>James William McDonald <div><span>1837 - 1911</span></div></li>
                            <li>Alice Mae Stewart McDonald <div><span>1855 - 1926</span></div></li>
                        </ul>
                        <h3>Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>William McDonald <div><span>1790 - 1856</span></div></li>
                            <li>Margaret Evans Van Metre McDonald <div><span>1798 - 1874</span></div></li>
                        </ul>
                        <h3>Old Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>James McDonald <div><span>1752 - 1830</span></div></li>
                            <li>Isabella Burns McDonald <div><span>1766 - 1840</span></div></li>
                        </ul>
                        <h3>Old Old Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>Andrew MacDonald 
                                <div><span>1724 - 1799</span></div>
                            </li>
                            <li>Hester McDonald <div><span>1730 - 1808</span></div></li>
                        </ul>
                        <h3>Old Old Old Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>Donald Roy MacDonald <div><span>1700 - 1749</span></div></li>
                            <li>Jean MacLeod MacDonald <div><span>1703 - unknown</span></div></li>
                        </ul>
                        <h3>Old Old Old Old Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>Dougall MacDonald <div><span>1680 - unknown</span></div></li>
                            <li>Christan Roberston MacDonald <div><span>1680 - 1706</span></div></li>
                        </ul>
                            <h3>Old Old Old Old Old Old Old Old Old Old McDonald</h3>
                        <ul>
                            <li>Unknown MacDonald from Inverness</li>
                        </ul>
                        <h3>Eldest McDonald</h3>
                        <ul>
                            <li>
                                <span><b>Somairle mac Gilla Brigte</b></span>
                                <span>King of the Isles</span>
                                <div><span>unknown - 1164 AD</span></div>
                            </li>
                            <li>
                                <span><b>Ragnhildr Óláfsdóttir</b></span>
                                <span>Queen of the Isles</span>
                                <span>Princess of Man</span>
                                <div><span>est. 1115 AD - unknown</span></div>
                            </li>
                        </ul>

                    </div>
                </BodyBlock>


                <h2>Five+ Generations Ago</h2>
                <div className={styles.gallery}>
                    <div>
                        <Image src="/deed.jpg" width={600} height={400} alt="18th century survey plat" />
                        <p>18th century survey plat for the tract of land purchased by William McDonald, intended to be used as a homeplace for his mother. This parcel is now known as Glencoe Farm</p>
                    </div>
                    <div>
                        <Image src="/james-w-mcdonald-choral-society.jpg" width={600} height={400} alt="Choral Society group" />
                        <p>The Choral Society, with James William McDonald pictured as tallest (center-right, back)</p>
                    </div>
                    <div>
                        <Image src="/alice-stewart-mcdonald.jpg" width={600} height={400} alt="Alice Stewart McDonald" />
                        <p>Alice Stewart McDonald, wife of James William McDonald</p>
                    </div>
                </div>
                <h2>Four Generations Ago</h2>
                <div className={styles.gallery}>
                    <div>
                        <Image src="/ernest-young.png" width={600} height={400} alt="Young Ernest Faulkner McDonald" />
                        <p>Young Ernest Faulkner McDonald</p>
                    </div>
                    <div>
                        <Image src="/mcdonaldporch.jpg" width={600} height={400} alt="McDonald family on porch" />
                        <p>McDonald Family gathered on the side porch at Glencoe Farm in 1929. Ernest Faulkner McDonald is pictured on the left</p>
                    </div>
                    <div>
                        <Image src="/ernest-mag-porch.jpg" width={600} height={400} alt="Family on porch 1926" />
                        <p>"Grandma Mag" (center), Elizabeth (center left) holding daughter Peggy, and Ernest Faulkner McDonald (center right)<br/>on the porch at Glencoe Farm in 1926 </p>
                    </div>
                    <div>
                        <Image src="/ernest-cherry.png" width={600} height={400} alt="Ernest McDonald with cherry tree" />
                        <p>Ernest Faulkner McDonald pictured with a cherry tree on the "hill field" at Glencoe Farm</p>
                    </div>
                    
                    <div>
                        <Image src="/barnunknown.png" width={600} height={400} alt="Old barn photo" />
                        <Image src="/barnunknown2.png" width={600} height={400} alt="Old barn photo 2" />
                        <p>Unknown folks pictured in front of the big white barn at Glencoe Farm, circa 1900</p>
                    </div>
                    <div>
                        <Image src="/hay-stack.jpg" width={600} height={400} alt="Straw stack" />
                        <p>Straw stack in the barnyard at Glencoe Farm</p>
                    </div>
                    <div>
                        <Image src="/mag-late-years.jpg" width={600} height={400} alt="Grandma Mag in later years" />
                        <p>Margaret "Grandma Mag" Borum McDonald in her late years</p>
                    </div>
                </div>
                <h2>Two and Three Generations Ago</h2>
                <div className={styles.gallery}>
                    <div>
                        <Image src="/richard-mcdonald-glencoe.jpg" width={600} height={400} alt="Richard Clyde McDonald" />
                        <p>Richard Clyde McDonald pictured in front of the workshop at Glencoe Farm</p>
                    </div>
                    
                    <div>
                        <Image src="/bubAndPeggy.jpg" width={600} height={400} alt="Peggy and Bub" />
                        <Image src="/bubAndPeggy2.png" width={600} height={400} alt="Peggy and Bub" />
                        <p>Peggy (left) and Charles "Bub" McDonald (right),  1929-1931</p>
                    </div>
                    <div>
                        <Image src="/mag-bub-and-peggy.png" width={600} height={400} alt="Grandma Mag with grandchildren" />
                        <p>"Grandma Mag" (right) with grandchildren Charles "Bub" McDonald (left) and Peggy McDonald (center)</p>
                    </div>
                    <div>
                        <Image src="/peg-mag-ernest-wedding.jpg" width={600} height={400} alt="Peggy McDonald wedding" />
                        <p>Wedding of Peggy McDonald Turner (left) with grandparents: <br/>
                            Margaret "Grandma Mag" Borum McDonald (center left) and<br/>
                            Ernest Faulkner McDonald (center right) <br/>
                            at the Glencoe Farmhouse
                        </p>
                    </div>
                    
                    <div>
                        <Image src="/willa-jean-child.jpg" width={600} height={400} alt="Willa Jean Hammersla" />
                        <p>Willa Jean Hammersla, circa 1930s</p>
                    </div>
                </div>
                <h2>One Generation Ago</h2>
                <div className={styles.gallery}>
                    
                    <div>
                        <Image src="/bub-willa-gail-kathy.png" width={600} height={400} alt="Bub and family" />
                        <p>
                            Charles "Bub" McDonald (right) and<br/>
                            Willa Jean Hammersla McDonald (left)<br/> with
                            daughters Gail McDonald Fidelman (right) and<br/>
                            Kathy (left), circa 1950s

                        </p>
                    </div>
                    <div>
                        <Image src="/mfm-moline.png" width={600} height={400} alt="Receiving tractor" />
                        <p>Charles "Bub" McDonald (middle) receiving a tractor for McDonald Farm Machinery, 1950</p>
                    </div>
                    <div>
                        <Image src="/charliebill1.png" width={600} height={400} alt="Charlie Bill McDonald" />
                        <p>Charles "Charlie Bill" McDonald, circa 1967</p>
                    </div>
                    <div>
                        <Image src="/limousin1.jpg" width={600} height={400} alt="Limousin cattle" />
                        <Image src="/limousin2.jpg" width={600} height={400} alt="Limousin cattle" />
                        <p>Limousin Cattle at Glencoe Farm</p>
                    </div>
                    <div>
                        <Image src="/reunion1.jpg" width={600} height={400} alt="Family reunion" />
                        <Image src="/reunion2.jpg" width={600} height={400} alt="Family reunion" />
                        <Image src="/reunion3.jpg" width={600} height={400} alt="Family reunion" />
                        <p>Annual McDonald Family Reunion at Glencoe Farm</p>
                    </div>
                    <div>
                        <Image src="/liam-zoey-porch.jpg" width={600} height={400} alt="Liam McDonald and dog" />
                        <p>Liam McDonald and dog Zoey on the porch at Glencoe Farm, 2003</p>
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