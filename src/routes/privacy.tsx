import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy, POPIA & Terms — Linamii" },
      {
        name: "description",
        content: "How Linamii collects, uses and protects your personal information under POPIA, plus our terms of use.",
      },
      { property: "og:title", content: "Privacy, POPIA & Terms — Linamii" },
      { property: "og:description", content: "How Linamii protects your information under POPIA." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Privacy Policy",
    body: "We collect only the information needed to fulfil your order, respond to your enquiries and improve your experience: your name, contact details, delivery address and order history. We do not sell your information.",
  },
  {
    title: "POPIA",
    body: "Linamii processes personal information in accordance with the Protection of Personal Information Act. Information submitted to The Fitting Room, including any uploaded images, is processed securely and only to provide personalised sizing and virtual fitting suggestions. Images are never shared without your consent. You may request access to, correction of, or deletion of your information at any time.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies and local storage to keep your bag and wishlist available on your device, and to keep the site secure and working as expected.",
  },
  {
    title: "Terms",
    body: "Prices are shown in South African Rand and include VAT where applicable. Orders are delivered nationwide via Bob Go. Handmade items may vary slightly from the photographs shown. Returns of unused items in original packaging are accepted within 14 days, in line with the Consumer Protection Act.",
  },
];

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <p className="text-xs tracking-[0.3em] text-caramel uppercase">Legal</p>
      <h1 className="mt-5 text-5xl">Privacy, POPIA & Terms</h1>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-3xl">{s.title}</h2>
            <p className="mt-4 leading-[1.9] text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}