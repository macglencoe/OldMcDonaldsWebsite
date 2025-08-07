import AbstractHero from "./abstractHero";

export default function HeroSummer() {
  return (
    <AbstractHero
      backdrop={{
        src: "/summer.webp",
        blurDataURL: "/summer-xs.webp",
      }}
      cta={{
        description: "Available through August 20",
        buttons: [
          {
            href: "/reservations",
            label: "Book your event",
            icon: "Calendar",
            trackEvent: { name: "Reservations", props: { location: "Hero Summer" } },
          },
          {
            href: "https://docs.google.com/forms/d/e/1FAIpQLSdNLOwNjhKnsI4QT18MCGOrEvxXP164zfLpXQOZSSBcJQxo3A/viewform?usp=header",
            label: "Apply to be a vendor",
            icon: "ArrowSquareOut",
            trackEvent: { name: "Vendor Application", props: { location: "Hero Summer" } },
          },
        ],
      }}
      seasonInfo={{
        title: "Open Soon",
        content: "We're still getting ready for the season",
      }}
    />
  );
}
