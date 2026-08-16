import styles from "./testimonials.module.css";

const testimonials = [
  {
    quote: "The staff is amazing, always welcoming and make us feel at home. If you have children, their playground area is wonderful, and they will love petting and seeing the farm animals.",
    author: "Selene",
  },
  {
    quote: "You can spend hours there getting lost in the corn maze, going for a hayride, and petting the animals. They have plenty of family-friendly activities and great photo ops!",
    author: "Camille Santiago",
  },
  {
    quote: "Admission is very low compared to other fall festival attractions. There are things to do for all ages, and it is very well run by the McDonald family.",
    author: "Bill Wolff",
  },
];

const reviewsUrl = "https://www.google.com/search?q=Old+McDonalds+Pumpkin+Patch+%26+Corn+Maze+Reviews";

export default function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>From our visitors</p>
        <h2 id="reviews-heading">A fall tradition worth sharing</h2>
        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <figure className={styles.card} key={testimonial.author}>
              <div className={styles.stars} aria-label="Five-star review">
                <span aria-hidden="true">★★★★★</span>
              </div>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>— {testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
        <a className={styles.link} href={reviewsUrl} target="_blank" rel="noopener noreferrer">Read more reviews on Google</a>
      </div>
    </section>
  );
}
