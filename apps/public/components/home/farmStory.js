import Image from "next/image";
import Link from "next/link";
import styles from "./homeSections.module.css";

export default function FarmStory() {
  return (
    <section className={`${styles.section} ${styles.storySection}`} aria-labelledby="farm-story-heading">
      <div className={`${styles.inner} ${styles.storyGrid}`}>
        <div className={styles.storyImage}>
          <Image
            fill
            sizes="(max-width: 850px) 100vw, 55vw"
            src="/mcdonaldporch.jpg"
            alt="The McDonald family gathered on the porch at Glencoe Farm in 1929"
          />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>Berkeley County, West Virginia</p>
          <h2 className={styles.heading} id="farm-story-heading">Rooted here for generations</h2>
          <p>
            Glencoe Farm has been part of the McDonald family story for more than 250 years. Six weekends each fall, we open our home place to the community and share the fields, traditions, and simple pleasures that keep us connected to this land.
          </p>
          <p>
            Preparing the farm is a year-round labor of love, and welcoming families back each season is the best part.
          </p>
          <Link className={styles.storyLink} href="/about">
            Read our story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
