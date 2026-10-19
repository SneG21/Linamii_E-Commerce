import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Linamii" },
      { name: "description", content: "Review your Linamii bag before secure Shopify checkout." },
      { property: "og:title", content: "Your Bag — Linamii" },
      { property: "og:description", content: "Review your Linamii bag before secure Shopify checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const currency = items[0]?.price.currencyCode ?? "ZAR";
  const subtotal = items.reduce((sum, i) => sum + Number(i.price.amount) * i.quantity, 0);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <h1 className="text-4xl md:text-5xl">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-card p-12 text-center shadow-[var(--shadow-soft)]">
          <p className="text-muted-foreground">Your bag is empty for now.</p>
          <Button variant="hero" size="pill" className="mt-6" asChild>
            <Link to="/shop">Shop Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {items.map((item) => {
              const node = item.product.node;
              const image = node.images?.edges?.[0]?.node;
              return (
                <div
                  key={item.variantId}
                  className="grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-5 rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)]"
                >
                  <Link to="/shop/$slug" params={{ slug: node.handle }}>
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText ?? node.title}
                        loading="lazy"
                        className="size-22 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="size-22 rounded-2xl bg-secondary" />
                    )}
                  </Link>
                  <div className="min-w-0">
                    <Link to="/shop/$slug" params={{ slug: node.handle }} className="font-display text-lg">
                      {node.title}
                    </Link>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {item.selectedOptions.map((o) => o.value).join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(Number(item.price.amount), item.price.currencyCode)}
                    </p>
                    <div className="mt-3 inline-flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label="Decrease"
                        className="px-3 py-1.5"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        className="px-3 py-1.5"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${node.title}`}
                    onClick={() => removeItem(item.variantId)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-3xl bg-card p-7 shadow-[var(--shadow-soft)]">
            <h2 className="text-2xl">Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Subtotal" value={formatMoney(subtotal, currency)} />
              <Row label="Delivery" value="Calculated at checkout" />
              <Row label="Discounts" value="Applied at checkout" />
            </dl>

            <div className="mt-6 flex justify-between border-t border-border pt-5 text-lg">
              <span>Total</span>
              <span className="text-caramel">{formatMoney(subtotal, currency)}</span>
            </div>

            <Button
              variant="hero"
              size="pill"
              className="mt-6 w-full"
              disabled={isLoading || isSyncing}
              onClick={checkout}
            >
              {isLoading || isSyncing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="mr-2 size-4" /> Checkout with Shopify
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Checkout, payments and orders are handled securely by Shopify.
            </p>

          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
