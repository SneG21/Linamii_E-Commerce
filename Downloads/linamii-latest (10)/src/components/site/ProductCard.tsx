import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatMoney, type UiProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, badge }: { product: UiProduct; badge?: string | undefined }) {
  const { toggleWishlist, wishlist } = useStore();
  const addItem = useCartStore((s) => s.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const wished = wishlist.includes(product.handle);
  const variants = product.variants ?? [];
  const images = product.images ?? [];
  const initialVariant = variants.find((v) => v.availableForSale) ?? variants[0];
  const initialImageIndex = Math.max(
    0,
    images.findIndex((image) => image.url === initialVariant?.image?.url),
  );
  const [variantId, setVariantId] = useState(initialVariant?.id ?? "");
  const [imageIndex, setImageIndex] = useState(initialImageIndex);
  const variant = variants.find((item) => item.id === variantId) ?? initialVariant;
  const activeImage = images[imageIndex] ?? images[0];
  const colorOption = product.options.find((option) => /^(color|colour)$/i.test(option.name));

  const imageForColor = (color: string) => {
    const normalizedColor = color.toLowerCase().replace(/[^a-z0-9]/g, "");
    return images.find((image) =>
      (image.altText ?? image.url).toLowerCase().replace(/[^a-z0-9]/g, "").includes(normalizedColor),
    );
  };

  const selectColor = (value: string) => {
    const matchingVariants = variants.filter((item) =>
      item.selectedOptions.some(
        (option) => /^(color|colour)$/i.test(option.name) && option.value === value,
      ),
    );
    const nextVariant = matchingVariants.find((item) => item.availableForSale) ?? matchingVariants[0];
    if (!nextVariant) return;
    setVariantId(nextVariant.id);
    const nextImage = imageForColor(value) ?? nextVariant.image;
    const nextImageIndex = images.findIndex((image) => image.url === nextImage?.url);
    if (nextImageIndex >= 0) setImageIndex(nextImageIndex);
  };

  const browseImage = (direction: -1 | 1) => {
    if (images.length < 2) return;
    setImageIndex((current) => (current + direction + images.length) % images.length);
  };

  const handleAddToCart = async () => {
    if (!variant || isAdding || !product.inStock) return;
    setIsAdding(true);
    try {
      await addItem({
        product: product.raw,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions ?? [],
      });
      toast.success(`${product.title} added to your bag`, {
        position: "top-center",
      });
    } catch (error) {
      console.error("Failed to add product to cart;", error);

      toast.error("Could not add product to your bag. Please try again");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative overflow-hidden bg-secondary">
        <Link to="/shop/$slug" params={{ slug: product.handle }}>
          {activeImage ? (
            <img
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center text-sm text-muted-foreground">
              No image yet
            </div>
          )}
        </Link>
        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="quiet"
              size="icon"
              aria-label={`Previous image of ${product.title}`}
              onClick={() => browseImage(-1)}
              className="absolute top-1/2 left-3 size-9 -translate-y-1/2 rounded-full bg-background/85 opacity-100 backdrop-blur md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="quiet"
              size="icon"
              aria-label={`Next image of ${product.title}`}
              onClick={() => browseImage(1)}
              className="absolute top-1/2 right-3 size-9 -translate-y-1/2 rounded-full bg-background/85 opacity-100 backdrop-blur md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight />
            </Button>
            <div className="absolute right-0 bottom-3 left-0 flex justify-center gap-1.5" aria-hidden="true">
              {images.map((image, index) => (
                <span
                  key={image.url}
                  className={cn(
                    "size-1.5 rounded-full bg-background/60 shadow-sm",
                    index === imageIndex && "bg-caramel",
                  )}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.handle)}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart className={cn("size-4", wished && "fill-caramel text-caramel")} />
        </button>
        {!product.inStock && (
          <span className="absolute top-4 left-4 rounded-full bg-background/85 px-3 py-1 text-[11px] tracking-widest uppercase">
            Sold out
          </span>
        )}
        {badge && product.inStock && (
          <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-[11px] tracking-widest text-caramel uppercase shadow-sm backdrop-blur">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-3 p-6">
        <p className="text-[11px] tracking-[0.25em] text-caramel uppercase">{product.vendor}</p>
        <div className="flex items-start justify-between gap-3">
          <Link to="/shop/$slug" params={{ slug: product.handle }} className="font-display text-xl">
            {product.title}
          </Link>
          <span className="pt-1 text-sm whitespace-nowrap text-caramel">
            {formatMoney(Number(variant?.price.amount ?? product.price), variant?.price.currencyCode ?? product.currencyCode)}
          </span>
        </div>
        {colorOption && colorOption.values.length > 1 && (
          <div>
            <p className="text-[11px] text-muted-foreground">
              Colour · {variant?.selectedOptions.find((option) => /^(color|colour)$/i.test(option.name))?.value}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colorOption.values.map((value) => {
                const colorVariant = variants.find((item) =>
                  item.selectedOptions.some(
                    (option) => /^(color|colour)$/i.test(option.name) && option.value === value,
                  ),
                );
                const selected = colorVariant?.selectedOptions.some(
                  (option) =>
                    /^(color|colour)$/i.test(option.name) &&
                    option.value ===
                      variant?.selectedOptions.find((selectedOption) =>
                        /^(color|colour)$/i.test(selectedOption.name),
                      )?.value,
                );
                return (
                  <Button
                    key={value}
                    type="button"
                    variant="quiet"
                    size="icon"
                    aria-label={`View ${value}`}
                    title={value}
                    onClick={() => selectColor(value)}
                    className={cn(
                      "size-10 overflow-hidden rounded-full p-0",
                      selected && "border-caramel ring-2 ring-caramel/30",
                    )}
                  >
                    {imageForColor(value) ?? colorVariant?.image ? (
                      <img
                        src={(imageForColor(value) ?? colorVariant?.image)?.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="px-1 text-[10px]">{value.slice(0, 3)}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        {product.short && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.short}</p>
        )}
        <Button
          variant="hero"
          size="pill"
          className="w-full"
          disabled={!product.inStock || isAdding || !variant}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : product.inStock ? (
            "Add to Cart"
          ) : (
            "Sold out"
          )}
        </Button>
      </div>
    </article>
  );
}
