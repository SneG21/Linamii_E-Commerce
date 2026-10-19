import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useCartStore } from "@/stores/cartStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/fitting-room", label: "The Fitting Room" },
  { to: "/about", label: "About Us" },
  { to: "/sell-with-us", label: "Sell With Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { wishlist } = useStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="font-display text-2xl tracking-[0.18em] text-foreground uppercase">
          Linamii
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-caramel" }}
              className="text-sm text-muted-foreground transition-colors hover:text-caramel"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 justify-self-end">
          <Link to="/shop" aria-label="Search" className="rounded-full p-2 hover:bg-secondary">
            <Search className="size-[18px]" />
          </Link>
          <Link to="/account" aria-label="Wishlist" className="relative rounded-full p-2 hover:bg-secondary">
            <Heart className="size-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 size-2 rounded-full bg-caramel" />
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 hover:bg-secondary">
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-caramel text-[10px] text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/account" aria-label="Login" className="rounded-full p-2 hover:bg-secondary">
            <User className="size-[18px]" />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-cream px-5 py-4 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}