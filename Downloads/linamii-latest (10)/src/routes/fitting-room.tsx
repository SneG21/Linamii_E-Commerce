import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/fitting-room")({
  head: () => ({
    meta: [
      { title: "The Fitting Room — Coming Soon | Linamii" },
      {
        name: "description",
        content:
          "Linamii's AI Fitting Room is coming soon. Join the waitlist for personalised baby sizing and product recommendations.",
      },
      { property: "og:title", content: "The Fitting Room — Coming Soon | Linamii" },
      {
        property: "og:description",
        content: "Join the waitlist for AI-powered baby sizing and product recommendations.",
      },
    ],
  }),
  component: FittingRoom,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

function FittingRoom() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email");
      return;
    }
    setError(null);
    setEmail("");
    toast.success("You're on the Fitting Room waitlist — we'll be in touch soon.");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
      <div className="inline-flex items-center justify-center rounded-full bg-caramel/10 px-4 py-2 text-xs tracking-[0.2em] text-caramel uppercase">
        <Sparkles className="mr-2 size-4" /> AI Powered
      </div>

      <h1 className="mt-8 font-display text-5xl md:text-6xl">The Fitting Room</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        A personal styling space for your little one. Get AI size recommendations, age-matched pieces, and a
        virtual preview of our softest cardigans — all POPIA-compliant and private.
      </p>

      <div className="mt-12 rounded-[2rem] bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
        <p className="font-display text-2xl">Coming soon</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We're busy building something magical. Be the first to know when The Fitting Room opens.
        </p>

        <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value.slice(0, 255))}
              className="h-12 rounded-full bg-background pl-11"
              required
            />
          </div>
          <Button type="submit" variant="hero" size="pill" className="h-12 px-8">
            Join the Waitlist
          </Button>
        </form>
        <p className="mx-auto mt-2 max-w-md text-right text-[11px] tracking-wide text-muted-foreground tabular-nums">
          {email.length} / 255 characters
        </p>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <FeatureNote title="Virtually Dress Your Baby" body="Preview our cardigans on a soft silhouette before you buy." />
        <FeatureNote title="AI Size Recommendation" body="The right cardigan size from age and height." />
        <FeatureNote title="AI Product Recommendation" body="Pieces suited to your baby's stage." />
      </div>
    </div>
  );
}

function FeatureNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-secondary/70 p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
