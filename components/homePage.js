"use client"
import Image from "next/image";
import styles from "./homePage.module.css";
import Layout from "@/components/layout";
import Calendar from "@/components/calendar";
import YearProgressBar from "@/components/yearProgress";
import OldMcDonutsAd from "@/components/oldMcDonutsAd";
import TestimonialCarousel from "@/components/testimonials";
import { ArrowLeft, ArrowSquareOut } from "phosphor-react";
import FacebookFeed from "./facebookFeed";




export default function HomePage( { summerHeroGate, fallHeroGate, winterHeroGate } ) {


  const events = [
    { name: 'Event 1', date: '2025-10-12' },
    { name: 'Event 2', date: '2025-10-15' },
    { name: 'Event 3', date: '2025-10-20' },
  ];

  const octoberOpenDates = [
    1, 2, 7, 8, 9, 14, 15, 16, 21, 22, 23, 28, 29, 30
  ];








  return (
    <Layout>
      <div className={styles.wrapper}>
        <section className={styles.hero}>
          {fallHeroGate && // Fall Hero
            <>
              <Image
                src="https://images.unsplash.com/photo-1572978385565-b4c1c4b9ce17?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEwfHxwdW1wa2luJTIwcGF0Y2h8ZW58MHx8fHwxNzQzMDE4NTUwfDA&ixlib=rb-4.0.3&w=1500"
                width={1500}
                height={1000}
                alt="Old McDonald's"
              />
              <div className={styles.cover}>
                <div className={styles.top}>
                  <h1 className={styles.tagline}>Real Farm Fun</h1>
                  <div>
                    <p className={styles.description}>Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family</p>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.cta}>
                    <p>See what we're all about</p>
                    <div className={styles.buttons}>
                      <a href="/visit">
                        Visit
                      </a>
                      <a href="/activities">
                        Activities
                        <ArrowLeft size={24} weight="bold" />
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Open Now</h2>
                      <p>Come visit us on the weekend!</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }

          {(summerHeroGate || (!fallHeroGate && !winterHeroGate && !summerHeroGate)) && // or default
            <>
              <Image
                src="/summer.jpg"
                width={1500}
                height={1000}
                alt="Old McDonald's"
              />
              <div className={styles.cover}>
                <div className={styles.top}>
                  <h1 className={styles.tagline}>Real Farm Fun</h1>
                  <div>
                    <p className={styles.description}>Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family</p>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.cta}>
                    <p>Available through August 20</p>
                    <div className={styles.buttons}>
                      <a href="/reservations">
                        <ArrowLeft size={24} weight="bold" />
                        Book Your Event
                      </a>
                      <a href="https://example.com">
                        Vendor Application
                        <ArrowSquareOut size={24} weight="bold" />
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Open Soon</h2>
                      <p>We'e still getting ready for the season</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }

          {winterHeroGate && // Winter Hero
            <>
              <Image
                src="https://images.unsplash.com/photo-1574457572226-7cc7ea7dd6c2?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1500}
                height={1000}
                alt="Old McDonald's"
              />
              <div className={styles.cover}>
                <div className={styles.top}>
                  <h1 className={styles.tagline}>Real Farm Fun</h1>
                  <div>
                    <p className={styles.winter + " " + styles.description}>Celebrate fall in Berkeley County, West Virginia with pumpkins, hayrides, and fun for the whole family</p>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.cta}>
                    <p>Want to reminisce?</p>
                    <div className={styles.buttons}>
                      <a href="/gallery">
                        <ArrowLeft size={24} weight="bold" />
                        Gallery
                      </a>
                    </div>
                  </div>
                  <div className={styles.seasonInfo}>
                    <div className={styles.card}>
                      <h2>Closed for the season</h2>
                      <p>We'll see you next year!</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        </section>
        <section className={styles.season}>
          <h1>2025 Season</h1>
          <div className={styles.times}>
            <ul>
              <li>
                <h2>Fridays</h2>
                <div>
                  <span>1:00 AM</span>
                  <span>6:00 PM</span>
                </div>
              </li>
              <li>
                <h2>Saturdays</h2>
                <div>
                  <span>11:00 AM</span>
                  <span>6:00 PM</span>
                </div>
              </li>
              <li>
                <h2>Sundays</h2>
                <div>
                  <span>12:00 PM</span>
                  <span>6:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.dates}>
            <ul>
              <li>
                September 26
              </li>
              <p>-</p>
              <li>
                October 26
              </li>
            </ul>
          </div>
        </section>
        <YearProgressBar highlightStart="2025-09-20" highlightEnd="2025-11-02" />
        <section className={styles.rates + " basic"}>
          <Image
            src="/willow.jpg"
            width={1500}
            height={1000}
            alt="Old McDonald's"
          />
          <div className={styles.overlay}></div>
          <h1>Rates</h1>
          <ul>
            <li>
              <h2>Admission</h2>
              <div className={styles.rateInfo}>
                <h3>Includes:</h3>
                <ul>
                  <li><a href="/activities/corn-maze">Corn Maze</a></li>
                  <li><a href="/activities/nature-trails">Nature Trails</a></li>
                  <li>Photo Opportunities</li>
                  <li>Various Games</li>
                  <li><a href="/activities/flower-fields">Sunflower Fields</a></li>
                  <li><a href="/activities/petting-zoo">Petting Zoo</a></li>
                  <li>Playground</li>
                  <li><a href="/vendors">Picnic Area</a></li>
                </ul>
              </div>
              <div className={styles.price}>
                <b>$6</b>
                <span>/ person*</span>
                <p>Must be paid at the admission booth</p>
              </div>
            </li>
            <li>
              <h2>Hayride</h2>
              <div className={styles.rateInfo}>
                <p>Take a tour of the farm on a hayride, featuring scenic views</p>
                <p>Rules apply</p>
              </div>
              <a className="button" href="/activities/hayrides">Learn More</a>
              <div className={styles.price}>
                <b>$4</b>
                <span>/ person*</span>
                <p>Must be paid at the admission booth</p>
              </div>
            </li>
            <li>
              <h2>U-Pick Pumpkins</h2>
              <div className={styles.rateInfo}>
                <p>Pick your own pumpkins and enjoy a scenic walk</p>
                <p>Carts for hauling pumpkins are available, but may be limited on busy days</p>
              </div>
              <a className="button" href="/activities/pumpkin-patch">Learn More</a>
              <div className={styles.price}>
                <b>¢50</b>
                <span>/ pound</span>
                <p>Must be paid at weighing station</p>
                <p>Card & cash are accepted</p>
              </div>
            </li>
            <li>
              <h2>U-Pick Flowers</h2>
              <div className={styles.rateInfo}>
                <p>Pick from our Zinnia & Sunflower fields, and enjoy a scenic walk</p>
                <p>Cutters and cups are available at the arrangement wagon, near the flower fields</p>
                <p>Vases are also available for sale at the arrangement wagon, priced individually</p>
              </div>
              <a className="button" href="/activities/flower-fields">Learn More</a>
              <div className={styles.price}>
                <b>$7</b>
                <span>/ cup</span>
                <p>Must be paid at the weighing station</p>
              </div>
            </li>
          </ul>
          <p>*Age 3 and under are free</p>

        </section>

        <OldMcDonutsAd
          title="Old McDonuts"
          description="Coffee, Apple Cider Donuts, and Slushies, right on the farm"
          href="/vendors/old-mcdonuts"
          buttonText="Menu"
          src="/oldMcDonuts.jpg"
        />
        <OldMcDonutsAd
          title="Twisted Taters"
          description="Butterfly Potatoes, Burgers, & more!"
          href="/vendors"
          buttonText="See More"
          src="/twistedTaters.jpg"
        />
        <TestimonialCarousel/>
        <FacebookFeed/>

        <section className={styles.about} id="about">
          <h1>About Us</h1>
          <div className={styles.infoTop}>
            <p>Take a break from the hustle and bustle of everyday and visit us on our family farm.<br></br>Glencoe Farm is located along Middle Creek, the stream runs through our park-like setting where you and your family can relax and enjoy the peaceful countryside. We are only open 6 weeks each Fall. This is a family effort to get the farm ready to open up to the community. All the work is done by our immediate family. It is a labor of love to be able to bring a farm experience to you and your family. We feel blessed to be able to share our home place with you!</p>
          </div>
          <div className={styles.infoBottom}>
            <Image src="/mcdonaldporch.jpg" width={1500} height={1000} alt="McDonald Family on Porch" />
            <div>
              <h2>We've got history!</h2>
              <p>The McDonald family has lived here on Glencoe farm for seven generations. Since the late 1700s, our farm has been in operation continously. Recently, we received a sestercentennial award - that means 250 years!</p>
              <p>Currently, the farm consists of 175 acres. Over the years, the farm has had many uses including an orchard, dairy & beef farm.  Currently the fields are used for hay, corn, and pumpkins.    Glencoe Farm is located along Middle Creek, the stream runs through our park-like setting where you and your family can relax and enjoy the peaceful countryside.</p>
              <p>In 2007, Glencoe was accepted into the Berkeley County Farm Preservation.  It is a great feeling knowing it will remain a green space and will be forever protected.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
