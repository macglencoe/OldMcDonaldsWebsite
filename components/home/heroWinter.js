import AbstractHero from "./abstractHero";

export default function HeroWinter() {
  return (
    <AbstractHero
      backdrop={{
        src: "https://images.unsplash.com/photo-1574457572226-7cc7ea7dd6c2?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }}
      cta={{
        description: "Want to reminisce?",
        buttons: [
          {
            href: "/gallery",
            label: "Gallery",
            icon: "ImageSquare",
            trackEvent: { name: "Gallery", props: { location: "Hero Winter" } }
          }
        ]
      }}
      seasonInfo={{
        title: "Closed for the season",
        content: "We'll see you next year!"
      }}
    />
  );
}
