import { ProductCard } from "@/components/site/ProductCard";
import type { UiProduct } from "@/lib/shopify";

export function ProductRow({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  items: UiProduct[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-24">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.3em] text-caramel uppercase">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
        {intro && <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>}
      </header>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </section>
  );
}
