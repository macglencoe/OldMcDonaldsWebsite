import Image from "next/image";
import Link from "next/link";
import styles from "./homeSections.module.css";

const activities = [
  {
    title: "Pumpkin Patch",
    description: "Pick your favorite straight from the field.",
    image: "/pumpkinlanes.jpg",
    href: "/activities/pumpkin-patch",
  },
  {
    title: "Corn Maze",
    description: "A new challenge takes shape among the rows each season.",
    image: "/cornMazeLane.jpg",
    href: "/activities/corn-maze",
  },
  {
    title: "Hayrides",
    description: "See Glencoe Farm from the hay wagon.",
    image: "/tractorSunset.jpg",
    href: "/activities/hayrides",
  },
  {
    title: "Farm Animals",
    description: "Make a few four-legged friends at the petting zoo.",
    image: "/pettingZooGoatAndGirl.jpg",
    href: "/activities",
  },
  {
    title: "Flower Fields",
    description: "Wander, take photos, and pick a colorful bouquet.",
    image: "/sunflowerBike.jpg",
    href: "/activities/flower-fields",
  },
  {
    title: "Nature Trails",
    description: "Slow down and explore the quieter side of the farm.",
    image: "/natureMazePath.jpg",
    href: "/activities/nature-trails",
  },
];

export default function ActivityShowcase() {
  return (
    <section className={styles.section} aria-labelledby="home-activities-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>A day at Glencoe Farm</p>
        <h2 className={styles.heading} id="home-activities-heading">Come make a little fall tradition</h2>
        <p className={styles.intro}>
          There is room here to explore, play, pick, and simply enjoy being outside together.
        </p>

        <div className={styles.activitiesGrid}>
          {activities.map((activity) => (
            <Link className={styles.activityCard} href={activity.href} key={activity.title}>
              <Image fill sizes="(max-width: 560px) 100vw, (max-width: 850px) 50vw, 33vw" src={activity.image} alt="" />
              <div className={styles.activityCopy}>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link className={styles.sectionLink} href="/activities">
          Explore all activities <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
