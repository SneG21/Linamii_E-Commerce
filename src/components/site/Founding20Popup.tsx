import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { sendFounding20Signup } from "@/lib/forms.functions";
import {
  FOUNDING20_CODE,
  FOUNDING20_IMAGE,
  FOUNDING20_POPUP_ACTIVE,
  FOUNDING20_STORAGE_KEY,
  FOUNDING20_SUPPRESS_DAYS,
} from "@/lib/founding20.config";

const INK = "#3C2A21";
const BG = "#FCF9F4";
const ACCENT = "#D4622B";

const schema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  consent: z.boolean().optional().default(false),
});


function isSuppressed() {
  try {
    const v = localStorage.getItem(FOUNDING20_STORAGE_KEY);
    if (!v) return false;
    return Date.now() - Number(v) < FOUNDING20_SUPPRESS_DAYS * 86400000;
  } catch {
    return false;
  }
}
function suppress() {
  try {
    localStorage.setItem(FOUNDING20_STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function Founding20Popup() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const excluded = pathname.startsWith("/cart") || pathname.startsWith("/checkout");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ firstName: "", email: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shown = useRef(false);
  const send = useServerFn(sendFounding20Signup);

  useEffect(() => {
    if (!FOUNDING20_POPUP_ACTIVE || excluded || shown.current || isSuppressed()) return;
    const show = () => {
      if (shown.current || isSuppressed()) return;
      shown.current = true;
      setOpen(true);
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) show();
    };
    const t = window.setTimeout(show, 8000);
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [excluded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    suppress();
    setOpen(false);
  }

  if (!FOUNDING20_POPUP_ACTIVE || !open || excluded) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await send({
        data: { firstName: r.data.firstName, email: r.data.email, consent: r.data.consent === true },
      });

      suppress();
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(FOUNDING20_CODE);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy — please copy it manually");
    }
  };

  const input =
    "w-full rounded-[16px] border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4622B]/40";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="f20-title"
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[16px] font-sans shadow-2xl md:grid-cols-2"
        style={{ background: BG, color: INK }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2"
          style={{ color: INK }}
        >
          <X className="size-4" />
        </button>
        <img
          src={FOUNDING20_IMAGE}
          alt="Linamii baby essentials"
          className="h-52 w-full object-cover md:h-full md:rounded-l-[16px]"
        />
        <div className="p-6 md:p-8">
          {!done ? (
            <form onSubmit={submit} noValidate className="space-y-4">
              <h2 id="f20-title" className="font-display text-3xl md:text-4xl" style={{ color: INK }}>
                Free delivery on your order
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: INK }}>
                Join the Linamii family and we will cover your delivery. Enter your details and we will send
                your free delivery code.
              </p>

              <div>
                <input
                  className={input}
                  placeholder="First name"
                  aria-label="First name"
                  maxLength={60}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                {errors["firstName"] && <p className="mt-1 text-xs text-destructive">{errors["firstName"]}</p>}
              </div>
              <div>
                <input
                  type="email"
                  className={input}
                  placeholder="Email address"
                  aria-label="Email address"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
              </div>
              <div>
                <label className="flex items-start gap-2 text-xs leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-[#D4622B]"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  />
                  <span>
                    I agree to receive emails from Linamii. I can unsubscribe at any time. (Optional)
                  </span>

                </label>
                <Link to="/privacy" onClick={() => setOpen(false)} className="mt-1 ml-6 block text-[11px] underline">
                  Read our Privacy Policy
                </Link>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-[16px] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                style={{ background: ACCENT }}
              >
                {sending ? "Sending…" : "Claim my free delivery"}
              </button>
              <button type="button" onClick={close} className="block w-full text-center text-xs underline">
                Maybe later
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <h2 id="f20-title" className="font-display text-3xl md:text-4xl">Your code is ready</h2>
              <div className="flex items-center justify-between gap-3 rounded-[16px] border-2 border-dashed bg-white p-4" style={{ borderColor: ACCENT }}>
                <span className="font-display text-3xl tracking-[0.15em]">{FOUNDING20_CODE}</span>
                <button type="button" onClick={copy} className="rounded-[16px] px-4 py-2 text-xs font-medium text-white" style={{ background: ACCENT }}>
                  Copy
                </button>
              </div>
              <p className="text-sm">Use it at checkout to get free delivery on your order.</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="block w-full rounded-[16px] px-5 py-3 text-center text-sm font-medium text-white"
                style={{ background: ACCENT }}
              >
                Start shopping
              </Link>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
