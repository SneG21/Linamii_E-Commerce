import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { formatMoney, productsQueryOptions } from "@/lib/shopify";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Linamii" },
      {
        name: "description",
        content: "Sign in to view orders, saved addresses, wishlist and A-moreYellow rewards.",
      },
      { property: "og:title", content: "Your Account — Linamii" },
      { property: "og:description", content: "Orders, wishlist and A-moreYellow rewards." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { wishlist, toggleWishlist } = useStore();
  const { data: products = [] } = useQuery(productsQueryOptions);
  const saved = products.filter((p) => wishlist.includes(p.handle));

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
      <p className="text-xs tracking-[0.3em] text-caramel uppercase">Your Account</p>
      <h1 className="mt-5 text-5xl md:text-6xl">Welcome to Linamii</h1>

      <div className="mt-10 rounded-[2rem] bg-card p-8 shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl">Sign in coming soon</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Accounts, order history, tracking and saved addresses will be powered by Shopify Customer Accounts
          once your store is connected. Your wishlist is saved on this device in the meantime.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="hero" size="pill" disabled>
            Sign in
          </Button>
          <Button variant="quiet" size="pill" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] bg-secondary/70 p-8">
        <h2 className="text-2xl">A-moreYellow Rewards</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Named for Amore and Yellow. Earn points on purchases, reviews and referrals, and redeem them at
          checkout.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="text-3xl">Wishlist</h2>
        {saved.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Nothing saved yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => (
              <div key={p.handle} className="rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)]">
                <Link to="/shop/$slug" params={{ slug: p.handle }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full rounded-2xl bg-secondary" />
                  )}
                </Link>
                <p className="mt-4 font-display text-lg">{p.title}</p>
                <p className="text-sm text-caramel">{formatMoney(p.price, p.currencyCode)}</p>
                <button
                  type="button"
                  onClick={() => toggleWishlist(p.handle)}
                  className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}