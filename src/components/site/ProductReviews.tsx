import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Star } from "lucide-react";
import { getProductReviews } from "@/lib/reviews.functions";
import { cn } from "@/lib/utils";

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("size-4 text-caramel", i <= Math.round(rating) && "fill-caramel")} />
      ))}
    </div>
  );
}

export function ProductReviews({ handle }: { handle: string }) {
  const fetchReviews = useServerFn(getProductReviews);
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", handle],
    queryFn: () => fetchReviews({ data: { handle } }),
    staleTime: 5 * 60 * 1000,
  });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Stars rating={avg} />
            <span>
              {avg.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>
      {isLoading ? (
        <p className="mt-4 text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
              <Stars rating={r.rating} />
              {r.title && <h3 className="mt-3 font-display text-lg">{r.title}</h3>}
              <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">{r.body}</p>
              {r.pictures.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.pictures.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" className="size-20 rounded-xl object-cover" />
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{r.name}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-xs text-caramel">
                    <BadgeCheck className="size-3.5" /> Verified buyer
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  · {new Date(r.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
