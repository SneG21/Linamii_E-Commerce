import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { sendContactEnquiry } from "@/lib/forms.functions";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountedInput, CountedTextarea } from "@/components/site/CountedField";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Linamii — We'd Love To Hear From You" },
      {
        name: "description",
        content: "Questions about sizing, gifting or delivery? Contact the Linamii team by email, phone or WhatsApp.",
      },
      { property: "og:title", content: "Contact Linamii" },
      { property: "og:description", content: "Reach the Linamii team by email, phone or WhatsApp." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Please add a little more detail").max(2000),
});

const faqs = [
  {
    q: "Which ages do you cater for?",
    a: "Linamii serves families from pregnancy through baby's first twelve months.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are delivered nationwide via Bob Go, usually within 2–4 working days.",
  },
  {
    q: "Are your products safe for newborns?",
    a: "Yes. We use food-grade, BPA-free silicone and OEKO-TEX yarn, chosen to be safe from birth.",
  },
  {
    q: "Can I send an order as a gift?",
    a: "Every gift set ships in our signature pouch, ribbon and box, with a note card included.",
  },
  {
    q: "How do I become a vendor?",
    a: "Apply through our Sell With Us page. We review for safety, quality and fit with babies 0–12 months.",
  },
];

function ContactPage() {
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [sending, setSending] = useState(false);
  const submitEnquiry = useServerFn(sendContactEnquiry);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setError(null);
    setSending(true);
    try {
      await submitEnquiry({ data: parsed.data });
      form.reset();
      setFormKey((k) => k + 1);
      toast.success("Thank you — we'll reply shortly.");
    } catch {
      toast.error("Sorry, your message could not be sent. Please email info@linamii.co.za.");
    } finally {
      setSending(false);
    }
  }


  return (
    <div className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
      <header className="max-w-xl">
        <p className="text-xs tracking-[0.3em] text-caramel uppercase">Contact</p>
        <h1 className="mt-5 text-5xl md:text-6xl">We'd love to hear from you</h1>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSubmit} className="rounded-[2rem] bg-card p-8 shadow-[var(--shadow-soft)]">
          <div className="grid gap-6 sm:grid-cols-2">
            <CountedInput key={`name-${formKey}`} name="name" label="Name" maxLength={100} required />
            <CountedInput
              key={`email-${formKey}`}
              name="email"
              label="Email"
              type="email"
              inputMode="email"
              maxLength={255}
              required
            />
          </div>
          <div className="mt-6">
            <CountedTextarea
              key={`message-${formKey}`}
              name="message"
              label="Message"
              rows={6}
              maxLength={2000}
              required
            />
          </div>
          {error && <p className="mt-5 text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="hero" size="pill" className="mt-8" disabled={sending}>
            {sending ? "Sending…" : "Send Message"}

          </Button>
        </form>

        <aside className="space-y-4">
          <ContactCard icon={<Mail className="size-4" />} label="Email" value="info@linamii.co.za" />
          <ContactCard icon={<Phone className="size-4" />} label="Phone" value="+27 71 868 0129" />
          <ContactCard icon={<MessageCircle className="size-4" />} label="WhatsApp" value="+27 71 868 0129" />
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="text-4xl">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

function ContactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
      <p className="flex items-center gap-2 text-xs tracking-[0.2em] text-caramel uppercase">
        {icon} {label}
      </p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}