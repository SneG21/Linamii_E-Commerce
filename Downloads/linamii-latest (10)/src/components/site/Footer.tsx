import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-sm">
          <p className="font-display text-2xl tracking-[0.18em] uppercase">Linamii</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A premium South African baby brand. Every product chosen with care, packaged with love,
            delivered with pride via Bob Go.
          </p>
        </div>

        <FooterCol
          title="Shop"
          items={[
            { label: "Feeding", to: "/shop" },
            { label: "Cardigans", to: "/shop" },
            { label: "Gift Sets", to: "/shop" },
          ]}
        />
        <FooterCol
          title="Linamii"
          items={[
            { label: "About Us", to: "/about" },
            { label: "Sell With Us", to: "/sell-with-us" },
            { label: "The Fitting Room", to: "/fitting-room" },
          ]}
        />
        <FooterCol
          title="Help"
          items={[
            { label: "Contact", to: "/contact" },
            { label: "Privacy Policy", to: "/privacy" },
            { label: "POPIA", to: "/privacy" },
            { label: "Terms", to: "/privacy" },
          ]}
        />
      </div>
      <div className="border-t border-border/60 px-5 py-6 text-center text-xs text-muted-foreground lg:px-8">
        © {new Date().getFullYear()} Linamii. A Brand of Price Land Enterprise (Pty) Ltd.
        <p className="mt-1.5">
          Designed by{" "}
          <a
            href="https://synaps-marketing.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            SYNAPS
          </a>
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-caramel uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}