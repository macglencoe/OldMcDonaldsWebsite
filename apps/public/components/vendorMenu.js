import Image from "next/image";
import Link from "next/link";

function formatUSD(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function VendorMenu({ sections, bgSrc, bgAlt, mapHref }) {
  return (
    <div className="body basic">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3 relative p-5 rounded-xl overflow-hidden">
          {bgSrc && (
            <div className="absolute inset-0 -z-20">
              <Image src={bgSrc} alt={bgAlt || "Vendor background"} priority fill className="object-cover object-center" />
            </div>
          )}
          <div className="absolute inset-0 -z-10 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(225, 225, 225, 0.8) 0%, rgba(225, 225, 225, 0.9) 40%, white 65%)'
          }}/>

          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold">Menu</h2>
            <p className="text-sm text-foreground/70">
              Subject to change. <Link href="/visit#hours" className="underline text-accent font-medium">See hours</Link>
            </p>
          </div>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-8 scroll-mt-24">
              <h3 className="text-xl font-semibold border-b-2 border-accent/80 pb-2 mb-4">{section.title}</h3>
              <ul className="!list-none pl-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {section.items.map((item) => (
                  <li
                    key={item.name}
                    className="relative bg-background rounded-lg p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:-translate-y-[1px]"
                  >
                    {typeof item.price === 'number' && (
                      <div className="absolute right-3 top-3 bg-accent/20 text-accent px-2 py-1 rounded-full text-sm font-semibold">
                        {formatUSD(item.price)}
                      </div>
                    )}
                    <h4 className="text-lg font-bold pr-24">{item.name}</h4>
                    {item.desc && <p className="text-sm text-foreground/80 mt-1">{item.desc}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>

        <aside className="lg:col-span-1 lg:sticky lg:top-8 space-y-4">
          <div className="bg-amber-50 rounded-lg p-4 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold mb-2">Menu Sections</h3>
            <ul className="list-disc list-inside">
              {sections.map((s) => (
                <li key={s.id}><Link href={`#${s.id}`} className="underline text-accent">{s.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-100 rounded-lg p-4 shadow-sm ring-1 ring-black/5">
            <h3 className="font-semibold mb-2">Plan Your Visit</h3>
            <ul className="space-y-2">
              <li><Link href="/vendors" className="underline text-accent">Back to Vendors</Link></li>
              {mapHref && <li><Link href={mapHref} className="underline text-accent">Find on the Map</Link></li>}
              <li><Link href="/#hours" className="underline text-accent">Hours & Admission</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

