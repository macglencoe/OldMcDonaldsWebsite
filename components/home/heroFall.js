import AbstractHero from "./abstractHero";

export default function HeroFall() {
  return (
    <AbstractHero
      backdrop={{
        src: "https://images.unsplash.com/photo-1572978385565-b4c1c4b9ce17?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEwfHxwdW1wa2luJTIwcGF0Y2h8ZW58MHx8fHwxNzQzMDE4NTUwfDA&ixlib=rb-4.0.3&w=1500",
      }}
      cta={{
        description: "See what we're all about",
        buttons: [
          {
            href: "/activities",
            label: "Activities",
            icon: "ArrowLeft",
            trackEvent: { name: "Activities", props: { location: "Hero Fall" } },
          },
          {
            href: "/visit",
            label: "Visit",
            icon: "NavigationArrow",
            trackEvent: { name: "Visit", props: { location: "Hero Fall" } },
          },
        ],
      }}
      seasonInfo={{
        title: "Open For The Season",
        content: "Come visit us on the weekend!",
      }}
    />
  );
}
