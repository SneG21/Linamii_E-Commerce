import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductReviews } from "@/components/site/ProductReviews";
import { Button } from "@/components/ui/button";
import { formatMoney, productsQueryOptions, type UiProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import zeroPayBanner from "@/assets/zeropay-banner-pink.png";
import mobicredLogo from "@/assets/mobicred-logo-rect.jpg";

export const Route = createFileRoute("/shop/$slug")({
  head: () => ({
    meta: [
      { title: "Product — Linamii" },
      { name: "description", content: "A Linamii boutique piece for 0–12 months." },
      { property: "og:title", content: "Product — Linamii" },
      { property: "og:description", content: "A Linamii boutique piece for 0–12 months." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products = [], isLoading } = useQuery(productsQueryOptions);
  const product = products.find((p) => p.handle === slug);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-24 text-muted-foreground lg:px-8">
        <Loader2 className="size-4 animate-spin" /> Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <h1 className="text-4xl">Product not found</h1>
        <p className="mt-4 text-muted-foreground">This piece may have sold out or moved.</p>
        <Button variant="hero" size="pill" className="mt-8" asChild>
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  return <ProductDetail product={product} related={products.filter((p) => p.handle !== slug).slice(0, 3)} />;
}

function ProductDetail({ product, related }: { product: UiProduct; related: UiProduct[] }) {
  const { toggleWishlist, wishlist } = useStore();
  const addItem = useCartStore((s) => s.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const [qty, setQty] = useState(1);
  const initialVariant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [variantId, setVariantId] = useState(
    initialVariant?.id ?? "",
  );
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const imageForColour = (colour: string | undefined) => {
    if (!colour) return undefined;
    const normalizedColour = colour.toLowerCase().replace(/[^a-z0-9]/g, "");
    return product.images.find((image) =>
      (image.altText ?? image.url).toLowerCase().replace(/[^a-z0-9]/g, "").includes(normalizedColour),
    );
  };
  const [imageIndex, setImageIndex] = useState(() =>
    Math.max(
      0,
      product.images.findIndex(
        (image) =>
          image.url === initialVariant?.image?.url ||
          image.url ===
            imageForColour(
              initialVariant?.selectedOptions.find((option) => /^(color|colour)$/i.test(option.name))?.value,
            )?.url,
      ),
    ),
  );
  const activeImage = product.images[imageIndex] ?? product.images[0];
  const colorOption = product.options.find((option) => /^(color|colour)$/i.test(option.name));
  const sizeOption = product.options.find((option) => /^(size|age)$/i.test(option.name));
  const wished = wishlist.includes(product.handle);

  const selectVariant = (nextVariantId: string) => {
    const nextVariant = product.variants.find((item) => item.id === nextVariantId);
    if (!nextVariant) return;
    setVariantId(nextVariant.id);
    const selectedColour = nextVariant.selectedOptions.find((option) =>
      /^(color|colour)$/i.test(option.name),
    )?.value;
    const nextImage = imageForColour(selectedColour) ?? nextVariant.image;
    const nextImageIndex = product.images.findIndex((image) => image.url === nextImage?.url);
    if (nextImageIndex >= 0) setImageIndex(nextImageIndex);
  };

  const selectOption = (optionName: string, value: string) => {
    const currentSelections = new Map(
      (variant?.selectedOptions ?? []).map((option) => [option.name.toLowerCase(), option.value]),
    );
    currentSelections.set(optionName.toLowerCase(), value);
    const matchingVariants = product.variants.filter((item) =>
      item.selectedOptions.every(
        (option) => currentSelections.get(option.name.toLowerCase()) === option.value,
      ),
    );
    const nextVariant = matchingVariants.find((item) => item.availableForSale) ?? matchingVariants[0];
    if (nextVariant) selectVariant(nextVariant.id);
  };

  const addToCart = async () => {
    if (!variant?.availableForSale || isAdding) return;
    setIsAdding(true);

    try {
      await addItem({
        product: product.raw,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: qty,
        selectedOptions: variant.selectedOptions ?? [],
      });

      toast.success(`${product.title} added to your bag`, {
        position: "top-center",
      });
    } catch (error) {
      console.error("Failed to add product to your cart:", error);

      toast.error("Could not add product to your bag. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <Link to="/shop" className="text-xs tracking-[0.2em] text-caramel uppercase">
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          {activeImage ? (
            <div className="group relative overflow-hidden rounded-3xl shadow-[var(--shadow-soft)]">
              <img
                src={activeImage.url}
                alt={activeImage.altText ?? product.title}
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="grid aspect-square w-full place-items-center rounded-3xl bg-secondary text-muted-foreground">
              No image yet
            </div>
          )}
        </div>

        <div className="lg:pt-6">
          <p className="text-xs tracking-[0.3em] text-caramel uppercase">
            {product.vendor} · {product.category}
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl">{product.title}</h1>
          <p className="mt-6 text-2xl text-caramel">
            {formatMoney(Number(variant?.price.amount ?? product.price), product.currencyCode)}
          </p>
          {product.description && (
            <p className="mt-6 leading-relaxed whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          )}

          {colorOption && colorOption.values.length > 1 && (
            <div className="mt-8">
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Colour · {variant?.selectedOptions.find((option) => /^(color|colour)$/i.test(option.name))?.value}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {colorOption.values.map((value) => {
                  const colorVariant = product.variants.find((item) =>
                    item.selectedOptions.some(
                      (option) => /^(color|colour)$/i.test(option.name) && option.value === value,
                    ),
                  );
                  const activeColor = variant?.selectedOptions.find((option) =>
                    /^(color|colour)$/i.test(option.name),
                  )?.value;
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant="quiet"
                      aria-label={`Select ${value}`}
                      title={value}
                      onClick={() => selectOption(colorOption.name, value)}
                      className={cn(
                        "h-16 w-16 overflow-hidden rounded-full p-0",
                        value === activeColor && "border-caramel ring-2 ring-caramel/30",
                      )}
                    >
                      {imageForColour(value) ?? colorVariant?.image ? (
                        <img
                          src={(imageForColour(value) ?? colorVariant?.image)?.url}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="px-2 text-xs">{value}</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {sizeOption && sizeOption.values.length > 0 && (
            <div className="mt-8">
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Age · {variant?.selectedOptions.find((option) => /^(size|age)$/i.test(option.name))?.value}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {sizeOption.values.map((value) => {
                  const selected = variant?.selectedOptions.some(
                    (option) => /^(size|age)$/i.test(option.name) && option.value === value,
                  );
                  const available = product.variants.some(
                    (item) =>
                      item.availableForSale &&
                      item.selectedOptions.some(
                        (option) => /^(size|age)$/i.test(option.name) && option.value === value,
                      ) &&
                      (!colorOption ||
                        item.selectedOptions.some(
                          (option) =>
                            /^(color|colour)$/i.test(option.name) &&
                            option.value ===
                              variant?.selectedOptions.find((current) =>
                                /^(color|colour)$/i.test(current.name),
                              )?.value,
                        )),
                  );
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant="quiet"
                      size="pill"
                      disabled={!available}
                      onClick={() => selectOption(sizeOption.name, value)}
                      className={cn(selected && "border-caramel bg-secondary ring-2 ring-caramel/30")}
                    >
                      {value}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button type="button" aria-label="Decrease" className="px-4 py-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button type="button" aria-label="Increase" className="px-4 py-2.5" onClick={() => setQty((q) => Math.min(10, q + 1))}>
                +
              </button>
            </div>
            <Button
              variant="hero"
              size="pill"
              disabled={!variant?.availableForSale || isAdding}
              onClick={addToCart}
            >
              {isAdding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : variant?.availableForSale ? (
                "Add to Cart"
              ) : (
                "Sold Out"
              )}
            </Button>
            <Button variant="quiet" size="pill" disabled={!variant?.availableForSale || isAdding} onClick={buyNow}>
              Buy Now
            </Button>
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => toggleWishlist(product.handle)}
              className="grid size-12 place-items-center rounded-full border border-border"
            >
              <Heart className={cn("size-4", wished && "fill-caramel text-caramel")} />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <img
              src={zeroPayBanner}
              alt="ZeroPay — shop now and pay later in three interest-free payments"
              loading="lazy"
              className="mx-auto h-auto max-w-[280px] object-contain"
            />
            <img
              src={mobicredLogo}
              alt="Mobicred — flexible credit account payments"
              loading="lazy"
              className="mx-auto h-auto max-w-[180px] object-contain"
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4" /> Delivered nationwide · secure checkout by Shopify
          </p>
        </div>
      </div>

      <ProductReviews handle={product.handle} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl">You may also love</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
