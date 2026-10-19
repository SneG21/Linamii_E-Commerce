import { ArrowRight } from "lucide-react";
import type { Brand } from "@/lib/shopify";

export function BrandCard({ brand, onClick }: { brand: Brand; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group h-full overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="overflow-hidden bg-secondary">
        {brand.image ? (
          <img
            src={brand.image}
            alt={brand.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center text-sm text-muted-foreground">
            {brand.name}
          </div>
        )}
      </div>
      <div className="space-y-2 p-6">
        <p className="text-[11px] tracking-[0.25em] text-caramel uppercase">
          {brand.categories.slice(0, 2).join(" · ")}
        </p>
        <h3 className="font-display text-2xl">{brand.name}</h3>
        <span className="inline-flex items-center gap-2 pt-2 text-sm text-caramel">
          Browse the aisle · {brand.count} {brand.count === 1 ? "piece" : "pieces"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}
