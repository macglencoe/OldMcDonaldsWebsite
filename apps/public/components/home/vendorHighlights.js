import Image from "next/image";
import Link from "next/link";
import styles from "./vendorHighlights.module.css";

function VendorAction({ action }) {
  const isExternal = /^https?:\/\//.test(action.href);

  if (isExternal) {
    return (
      <a className={styles.action} href={action.href} target="_blank" rel="noopener noreferrer">
        {action.label} <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link className={styles.action} href={action.href}>
      {action.label} <span aria-hidden="true">→</span>
    </Link>
  );
}

function VendorSpotlight({ vendor }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageFrame}>
        <Image
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          src={vendor.image.src}
          alt={vendor.image.alt}
          className={styles.image}
          style={{ objectPosition: vendor.image.position || "center" }}
        />
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardEyebrow}>{vendor.label || "Featured vendor"}</p>
        <h3>{vendor.name}</h3>
        <p className={styles.description}>{vendor.description}</p>
        {Array.isArray(vendor.actions) && vendor.actions.length > 0 && (
          <div className={styles.actions}>
            {vendor.actions.map((action) => (
              <VendorAction action={action} key={`${action.href}-${action.label}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function VendorHighlights({ vendors = [] }) {
  if (!vendors.length) return null;

  return (
    <section className={styles.section} aria-labelledby="vendor-highlights-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Food at the farm</p>
          <h2 id="vendor-highlights-heading">Come hungry</h2>
          <p>
            Take a break between the maze and pumpkin patch with warm treats, cold drinks, and festival favorites from our on-farm vendors.
          </p>
        </header>

        <div className={styles.grid}>
          {vendors.map((vendor) => (
            <VendorSpotlight key={vendor.name} vendor={vendor} />
          ))}
        </div>

        <Link className={styles.allVendorsLink} href="/vendors">
          Meet all of our vendors <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
