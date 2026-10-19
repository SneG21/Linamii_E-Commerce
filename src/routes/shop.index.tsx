import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BrandCard } from "@/components/site/BrandCard";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductRow } from "@/components/site/ProductRow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deriveBrands, deriveCategories, productsQueryOptions, type UiProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "The Shop — Linamii Baby Boutique" },
      {
        name: "description",
        content:
          "Walk the aisles of Linamii: our signature collection, partner brands and local makers — feeding, cardigans, gift sets and bundles for 0–12 months.",
      },
      { property: "og:title", content: "The Shop — Linamii Baby Boutique" },
      {
        property: "og:description",
        content: "A curated baby boutique of trusted brands and local makers, all in one trusted place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "price-asc" | "price-desc";

function ShopPage() {
  const { data: products = [], isLoading, isError } = useQuery(productsQueryOptions);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "All">("All");
  const [brand, setBrand] = useState<string | "All">("All");
  const [age, setAge] = useState<"All" | "0-6" | "6-12" | "36-72">("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const allProductsRef = useRef<HTMLDivElement>(null);

  const brands = useMemo(() => deriveBrands(products), [products]);
  const categories = useMemo(() => deriveCategories(products), [products]);
  const maxCatalogPrice = useMemo(
    () => products.reduce((max, p) => Math.max(max, p.price), 0),
    [products],
  );

  const signature = brands.filter((b) => b.kind === "signature");
  const partners = brands.filter((b) => b.kind === "partner");
  const makers = brands.filter((b) => b.kind === "local-maker");

  const results = useMemo(() => {
    const list = products.filter((p) => {
      if (category !== "All" && !(p.categories ?? []).includes(category)) return false;
      if (brand !== "All" && p.vendorSlug !== brand) return false;
      if (inStockOnly && !p.inStock) return false;
      if (age === "0-6" && p.minAge >= 6) return false;
      if (age === "6-12" && (p.minAge < 6 || p.minAge >= 36)) return false;
      if (age === "36-72" && p.minAge < 36) return false;
      if (query && !`${p.title} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products, query, category, brand, age, inStockOnly, sort]);

  const scrollToAll = () =>
    allProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const focusAisle = (brandSlug: string) => {
    setBrand(brandSlug);
    setCategory("All");
    scrollToAll();
  };

  const newArrivals = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.bestSeller);
  const alsoLike = products.filter((p) => !p.isNew && !p.bestSeller).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs tracking-[0.3em] text-caramel uppercase">The Shop</p>
        <h1 className="mt-4 text-4xl md:text-6xl">Little aisles, carefully filled</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Linamii is our own signature collection — and the home of trusted brands and local makers we have
          chosen ourselves. Take your time: every aisle has been walked before you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {signature[0] && (
            <Button variant="hero" size="pill" onClick={() => focusAisle(signature[0]!.slug)}>
              Shop {signature[0]!.name}
            </Button>
          )}
          <Button
            variant="quiet"
            size="pill"
            onClick={() => {
              setBrand("All");
              scrollToAll();
            }}
          >
            Browse all {products.length} products
          </Button>
        </div>
      </header>

      {isLoading && (
        <div className="mt-20 flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading the shelves…
        </div>
      )}

      {isError && (
        <p className="mt-20 text-muted-foreground">
          We couldn't load the catalogue just now. Please refresh in a moment.
        </p>
      )}

      {!isLoading && products.length === 0 && (
        <p className="mt-20 rounded-3xl bg-card p-10 text-center text-muted-foreground shadow-[var(--shadow-soft)]">
          No products found.
        </p>
      )}

      {products.length > 0 && (
        <>
          {/* Explore our aisles */}
          <section className="mt-20">
            <p className="text-xs tracking-[0.3em] text-caramel uppercase">Explore Our Aisles</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Where would you like to wander?</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategory(c);
                    setBrand("All");
                    scrollToAll();
                  }}
                  className="rounded-3xl bg-card p-6 text-left shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <p className="font-display text-2xl">{c}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {products.filter((p) => (p.categories ?? []).includes(c)).length} pieces
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Signature collection */}
          {signature.map((b) => (
            <section
              key={b.slug}
              className="mt-24 overflow-hidden rounded-[2rem] bg-secondary/60 p-8 md:p-12"
            >
              <p className="text-xs tracking-[0.3em] text-caramel uppercase">Our Signature Collection</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">{b.name}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                The pieces we designed first — and the heart of everything in the store.
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {products
                  .filter((p) => p.vendorSlug === b.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard key={p.handle} product={p} />
                  ))}
              </div>
            </section>
          ))}

          {/* Featured partner brands */}
          {partners.length > 0 && (
            <section className="mt-24">
              <p className="text-xs tracking-[0.3em] text-caramel uppercase">Featured Partner Brands</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Brands we trust</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {partners.map((b) => (
                  <BrandCard key={b.slug} brand={b} onClick={() => focusAisle(b.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* Local makers */}
          {makers.length > 0 && (
            <section className="mt-24">
              <p className="text-xs tracking-[0.3em] text-caramel uppercase">Local Makers</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Made by hand, close to home</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {makers.map((b) => (
                  <BrandCard key={b.slug} brand={b} onClick={() => focusAisle(b.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* All products + filters */}
          <section ref={allProductsRef} className="mt-24 scroll-mt-24">
            <p className="text-xs tracking-[0.3em] text-caramel uppercase">All Products</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">The full shelf</h2>

            <div className="mt-8 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="h-fit space-y-7 rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Search</p>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="mt-3 rounded-full bg-background"
                  />
                </div>

                <FilterGroup
                  label="Brand"
                  options={["All", ...brands.map((b) => b.slug)]}
                  labels={{ All: "All brands", ...Object.fromEntries(brands.map((b) => [b.slug, b.name])) }}
                  value={brand}
                  onChange={setBrand}
                />

                <FilterGroup
                  label="Category"
                  options={["All", ...categories]}
                  value={category}
                  onChange={setCategory}
                />

                <FilterGroup
                  label="Age"
                  options={["All", "0-6", "6-12", "36-72"]}
                  labels={{
                    All: "All ages",
                    "0-6": "0–6 months",
                    "6-12": "6–12 months",
                    "36-72": "3–6 years",
                  }}
                  value={age}
                  onChange={(v) => setAge(v as typeof age)}
                />

                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="size-4 accent-current"
                  />
                  In stock only
                </label>

                <div>
                  <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Sort</p>
                  <FilterGroup
                    label=""
                    options={["featured", "price-asc", "price-desc"]}
                    labels={{
                      featured: "Featured",
                      "price-asc": "Price: low to high",
                      "price-desc": "Price: high to low",
                    }}
                    value={sort}
                    onChange={(v) => setSort(v as Sort)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setBrand("All");
                    setCategory("All");
                    setAge("All");
                    setInStockOnly(false);
                    setSort("featured");
                  }}
                  className="text-xs text-caramel underline-offset-4 hover:underline"
                >
                  Clear all filters
                </button>
              </aside>

              <div>
                <p className="text-sm text-muted-foreground">
                  {results.length} of {products.length} products
                  {maxCatalogPrice > 0 ? "" : ""}
                </p>
                {results.length === 0 ? (
                  <p className="mt-8 rounded-3xl bg-card p-10 text-center text-muted-foreground shadow-[var(--shadow-soft)]">
                    No products found.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {results.map((p: UiProduct) => (
                      <ProductCard key={p.handle} product={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <ProductRow
            eyebrow="New Arrivals"
            title="Just off the shelf"
            items={newArrivals}
            intro="The most recent additions to the boutique."
          />
          <ProductRow eyebrow="Best Sellers" title="Loved by families" items={bestSellers} />
          <ProductRow eyebrow="You May Also Like" title="A little more to browse" items={alsoLike} />
        </>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      {label && <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{label}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
              value === o ? "border-caramel text-caramel" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {labels?.[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}
