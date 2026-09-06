import Image from "next/image";
import styles from "./article.module.css";

function classes(...values) {
  return values.filter(Boolean).join(" ");
}

export function ArticleLayout({ children, className }) {
  return (
    <article className={classes(styles.article, "basic", className)}>
      {children}
    </article>
  );
}

export function ArticleSection({
  children,
  id,
  image,
  imageAlt = "",
  imagePosition = "right",
  imageAttribution = false,
  imagePriority = false,
  imageFocalPoint = "center",
  imageRatio = "portrait",
  caption,
  tone = "default",
  className,
}) {
  const hasImage = Boolean(image);

  return (
    <section
      id={id}
      className={classes(
        styles.section,
        hasImage ? styles.withImage : styles.textOnly,
        imagePosition === "left" && styles.imageLeft,
        imageRatio === "landscape" && styles.mediaLandscape,
        imageRatio === "square" && styles.mediaSquare,
        tone === "night" && styles.night,
        tone === "warm" && styles.warm,
        className,
      )}
    >
      <div className={styles.content}>{children}</div>

      {hasImage && (
        <figure className={styles.media}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={imagePriority}
            sizes="(max-width: 760px) calc(100vw - 1rem), (max-width: 1200px) 36vw, 430px"
            style={{ objectPosition: imageFocalPoint }}
          />
          {(caption || imageAttribution) && (
            <figcaption>
              {caption && <span>{caption}</span>}
              {caption && imageAttribution && <span aria-hidden="true"> · </span>}
              {imageAttribution && <a href="/attribution">Photo attribution</a>}
            </figcaption>
          )}
        </figure>
      )}
    </section>
  );
}

export function ArticleLead({
  image,
  imageAlt,
  imageAttribution = false,
  eyebrow,
  heading,
  children,
  caption,
  imageFocalPoint = "center",
  imagePriority = true,
  tone = "default",
}) {
  return (
    <section className={classes(styles.lead, tone === "night" && styles.leadNight)}>
      <figure className={styles.leadMedia}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={imagePriority}
          sizes="(max-width: 760px) calc(100vw - 1rem), 1180px"
          style={{ objectPosition: imageFocalPoint }}
        />
        {(caption || imageAttribution) && (
          <figcaption>
            {caption && <span>{caption}</span>}
            {caption && imageAttribution && <span aria-hidden="true"> · </span>}
            {imageAttribution && <a href="/attribution">Photo attribution</a>}
          </figcaption>
        )}
      </figure>
      <div className={styles.leadContent}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        {heading && <h2>{heading}</h2>}
        <div className={styles.leadDeck}>{children}</div>
      </div>
    </section>
  );
}

export function ArticleFacts({ items, title, variant = "default" }) {
  return (
    <section className={classes(styles.facts, variant === "compact" && styles.factsCompact)} aria-label={title ?? "At a glance"}>
      {title && <h2>{title}</h2>}
      <ul>
        {items.map(({ value, label, detail }) => (
          <li key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
            {detail && <small>{detail}</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticleQuote({ children, cite }) {
  return (
    <figure className={styles.quote}>
      <blockquote>{children}</blockquote>
      {cite && <figcaption>— {cite}</figcaption>}
    </figure>
  );
}

export function ArticleTimeline({ title, intro, items, eyebrow }) {
  return (
    <section className={styles.timeline}>
      <header>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      <ol>
        {items.map(({ year, title: itemTitle, description }) => (
          <li key={`${year}-${itemTitle}`}>
            <time>{year}</time>
            <div>
              <h3>{itemTitle}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleRules({ title = "Rules", intro, items, eyebrow }) {
  return (
    <section className={styles.rules}>
      <header>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      <ol>
        {items.map(({ title: itemTitle, description }, index) => (
          <li key={itemTitle}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{itemTitle}</h3>
              {description && <p>{description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleSteps({ title, intro, items, eyebrow }) {
  return (
    <section className={styles.steps}>
      <header>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      <ol>
        {items.map(({ title: itemTitle, description }, index) => (
          <li key={itemTitle}>
            <span>{index + 1}</span>
            <h3>{itemTitle}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleNotice({ title, eyebrow, children, tone = "default", action }) {
  return (
    <aside className={classes(styles.notice, tone === "weather" && styles.noticeWeather, tone === "night" && styles.noticeNight)}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2>{title}</h2>
        <div className={styles.noticeBody}>{children}</div>
      </div>
      {action && <div className={styles.noticeAction}>{action}</div>}
    </aside>
  );
}

export function ArticleDivider({ label }) {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span />
      {label && <b>{label}</b>}
      <span />
    </div>
  );
}

export function ArticleCallout({ children, tone = "accent", className }) {
  return (
    <section
      className={classes(
        styles.callout,
        tone === "quiet" && styles.calloutQuiet,
        tone === "night" && styles.calloutNight,
        className,
      )}
    >
      {children}
    </section>
  );
}
