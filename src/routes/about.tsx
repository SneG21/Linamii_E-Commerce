import { createFileRoute } from "@tanstack/react-router";
import aboutImage from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Linamii" },
      {
        name: "description",
        content:
          "Linamii began with a God-given vision and a father's love for his daughters. Read the story behind our premium South African baby brand.",
      },
      { property: "og:title", content: "Our Story — Linamii" },
      {
        property: "og:description",
        content: "The story behind Linamii, a premium South African baby brand built on faith and family.",
      },
    ],
  }),
  component: AboutPage,
});

const paragraphs = [
  "Linamii began the way many good things do, quietly, in a season that asked a lot of me.",
  "A friend wanted to gift my daughter a silicone feeding set, and asked what to engrave on it. I gave him her name, Linamii. In full it is LinamiiZulu, which means God is with me. When he sent the photos of that finished gift, something settled in me. I turned to my partner and said, we could make this a brand.",
  "I didn't know where to begin. Then early one morning the thought of Linamii returned, and this time it would not leave. I woke the people I trust and told them, this is the vision, this is what we build. Within days we had a team: my partner, the friend who gave that first gift, and a former colleague. We were on our way.",
  "I won't take the credit for founding Linamii. It is a God-given vision, built on the foundation of a kingdom business and the South African family values we were raised on, neighbourliness, giving and sharing. And it took a village. Every person who gave feedback, from a poster to the website, helped shape what Linamii is. \u201CIt takes a village to raise a child\u201D, and there are many ways to belong to ours.",
  "Our name for love has a colour. Our rewards programme, A-moreYellow, carries my daughters' names, Amore and Yellow, because Linamii is, at its heart, about love. Love for our customers, and love for the little ones we serve, from pregnancy through the first twelve months.",
  "We are building Linamii to be a mother's helper: convenient, thoughtful, and there in the moments that matter, whether a mother is too far along to reach the shops, or a friend is searching for the perfect gift for a baby shower. And we are opening our doors wider, inviting township and local vendors of baby products to sell alongside us, so that one shop can carry a family through the beginning.",
  "Linamii is premium and picky, just as our little ones do and deserve. Dreaming beyond our borders, while staying rooted in the values that raised us.",
];

const values = ["Faith", "Family", "Love", "Safety", "Community", "Supporting Local", "Premium Quality"];

function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <p className="text-xs tracking-[0.3em] text-caramel uppercase">About Linamii</p>
      <h1 className="mt-5 text-5xl md:text-6xl">Our Story</h1>

      <img
        src={aboutImage}
        alt="Hands folding a cream knitted baby blanket"
        loading="lazy"
        width={1200}
        height={900}
        className="mt-12 w-full rounded-[2.5rem] object-cover shadow-[var(--shadow-soft)]"
      />

      <div className="mt-12 space-y-7">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 30)} className="text-[1.05rem] leading-[1.9] text-muted-foreground">
            {p}
          </p>
        ))}
      </div>

      <p className="mt-12 font-display text-3xl text-caramel">Made with love, for little ones.</p>

      <div className="mt-14 flex flex-wrap gap-2.5">
        {values.map((v) => (
          <span key={v} className="rounded-full bg-secondary px-4 py-2 text-xs tracking-[0.15em] uppercase">
            {v}
          </span>
        ))}
      </div>
    </article>
  );
}