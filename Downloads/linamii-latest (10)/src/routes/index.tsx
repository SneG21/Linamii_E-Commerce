import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gift, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQueryOptions } from "@/lib/shopify";
import heroImage from "@/assets/hero.jpg";
import aboutImage from "@/assets/about.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linamii" },
      {
        name: "description",
        content:
          "Premium South African baby essentials chosen with care for every little journey, from pregnancy through the first twelve months.",
      },
      { property: "og:title", content: "Linamii" },
      {
        property: "og:description",
        content: "Premium South African baby essentials chosen with care for every little journey.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery(productsQueryOptions);
  const withFeatured = products.filter((p) => p.featured);
  const book = products.find((p) => p.handle === "gods-promises-for-kids");
  const featuredPool = withFeatured.length > 0 ? withFeatured : products;
  const featured = [
    ...(book ? [book] : []),
    ...featuredPool.filter((p) => p.handle !== book?.handle),
  ].slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Baby cardigan, silicone feeding bowl and muslin cloths on warm linen"
          width={1920}
          height={1200}
          className="h-[78vh] min-h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <div className="fade-up max-w-xl">
              
              <h1 className="mt-6 text-5xl leading-[1.05] md:text-7xl">Made With Love For Little Ones</h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Premium baby essentials chosen with care for every little journey.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button variant="hero" size="pill" asChild>
                  <Link to="/shop">Shop Collection</Link>
                </Button>
                <Button variant="quiet" size="pill" asChild>
                  <Link to="/fitting-room">Explore More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="float-soft absolute right-10 bottom-12 hidden rounded-full bg-background/80 px-6 py-4 shadow-[var(--shadow-soft)] backdrop-blur lg:block">
          <p className="text-xs tracking-[0.2em] text-caramel uppercase">0–12 months</p>
          <p className="mt-1 font-display text-lg">Every little journey</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-caramel uppercase">Featured Collection</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Little favourites</h2>
          </div>
          <Link to="/shop" className="text-sm text-caramel underline-offset-4 hover:underline">
            View all products
          </Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.handle}
              product={p}
              badge={p.handle === "gods-promises-for-kids" ? "New Arrival" : undefined}
            />
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-caramel uppercase">Made With Care</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Why Linamii</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <ValueCard
              icon={<Sparkles className="size-5" />}
              title="Safe by Standard"
              body="Food-grade, BPA-free silicone and OEKO-TEX yarn. Every item is chosen to be safe for babies from birth."
            />
            <ValueCard
              icon={<Heart className="size-5" />}
              title="Locally Hand-crafted"
              body="Our cardigans are hand-crocheted in small batches by local South African makers, so each piece is one of a kind."
            />
            <ValueCard
              icon={<Gift className="size-5" />}
              title="Gift-ready Packaging"
              body="Signature pouch, ribbon and gift box on every gift set. Beautiful the moment it arrives, ready to give."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <img
            src={aboutImage}
            alt="Hands folding a cream knitted baby blanket"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full rounded-[2.5rem] object-cover shadow-[var(--shadow-soft)]"
          />
          <div>
            <p className="text-xs tracking-[0.3em] text-caramel uppercase">Our Story</p>
            <h2 className="mt-4 text-4xl md:text-5xl">About Linamii</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Linamii was born from a God-given vision and a father's love for his daughters. Named for our
              youngest, Linamii, it grew from a single engraved gift into a dream: beautiful, trustworthy baby
              products for every family. Built on faith, family and the values we were raised on,
              neighbourliness, giving and sharing.
            </p>
            <Button variant="hero" size="pill" className="mt-8" asChild>
              <Link to="/about">Read More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="rounded-[2.5rem] bg-card p-10 text-center shadow-[var(--shadow-soft)] md:p-16">
          <p className="text-xs tracking-[0.3em] text-caramel uppercase">Sell With Us</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Make something beautiful for babies 0–12 months?</h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Join the Linamii platform. We give you the storefront and the marketing. In partnership with
            KasiKonnect.
          </p>
          <Button variant="hero" size="pill" className="mt-8" asChild>
            <Link to="/sell-with-us">Become A Vendor</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function ValueCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="grid size-11 place-items-center rounded-full bg-secondary text-caramel">{icon}</div>
      <h3 className="mt-6 text-2xl">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}