import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { sendVendorApplication } from "@/lib/forms.functions";

import {
  Apple,
  Ban,
  CheckCircle2,
  FileText,
  Handshake,
  Info,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  DocumentUpload,
  DOC_REQUIREMENTS,
  type DocFiles,
} from "@/components/site/DocumentUpload";
import { CountedInput, CountedTextarea } from "@/components/site/CountedField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/sell-with-us")({
  head: () => ({
    meta: [
      { title: "Sell With Us — Vendor Application | Linamii" },
      {
        name: "description",
        content:
          "Apply to become a Linamii vendor and showcase your baby products in our curated boutique, in partnership with KasiKonnect x SYNAPS.",
      },
      {
        property: "og:title",
        content: "Sell With Us — Vendor Application | Linamii",
      },
      {
        property: "og:description",
        content:
          "Apply to become a Linamii vendor, in partnership with KasiKonnect x SYNAPS.",
      },
    ],
  }),
  component: SellWithUs,
});

const REG_NUMBER_PATTERN = /^[A-Za-z0-9\-/ ]{5,30}$/;

function SellWithUs() {
  const [regNumber, setRegNumber] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocFiles>({});
  const [docsError, setDocsError] = useState<string | null>(null);
  const [hasWebsite, setHasWebsite] = useState<"yes" | "no" | null>(null);
  const [wantsSynaps, setWantsSynaps] = useState(false);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const submitApplication = useServerFn(sendVendorApplication);


  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    let valid = true;

    const trimmedReg = regNumber.trim();
    if (!REG_NUMBER_PATTERN.test(trimmedReg)) {
      setRegError("Enter a valid company registration number (5–30 characters).");
      valid = false;
    } else {
      setRegError(null);
    }

    const missing = DOC_REQUIREMENTS.filter(
      (r) => r.required && (docs[r.id] ?? []).length === 0
    );
    if (missing.length) {
      setDocsError(`Please upload: ${missing.map((m) => m.label).join(", ")}`);
      valid = false;
    } else {
      setDocsError(null);
    }

    if (!hasWebsite) {
      setWebsiteError("Please tell us whether you have a website.");
      valid = false;
    } else {
      setWebsiteError(null);
    }

    if (!valid) return;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const documents = DOC_REQUIREMENTS.flatMap((r) =>
      (docs[r.id] ?? []).map((f) => `${r.label}: ${f.name}`)
    );

    setSending(true);
    try {
      await submitApplication({
        data: {
          registrationNumber: trimmedReg,
          businessName: String(fd.get("businessName") ?? ""),
          contactName: String(fd.get("contactName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          productTypes: String(fd.get("productTypes") ?? ""),
          about: String(fd.get("about") ?? ""),
          website:
            hasWebsite === "yes"
              ? String(fd.get("websiteUrl") ?? "")
              : "No website",
          wantsSynaps: hasWebsite === "no" && wantsSynaps,
          documents,
        },
      });

      form.reset();
      setRegNumber("");
      setDocs({});
      setHasWebsite(null);
      setWantsSynaps(false);
      toast.success(
        "Thank you! Your vendor application has been submitted — we'll be in touch soon."
      );
    } catch {
      toast.error(
        "Sorry, your application could not be sent. Please email info@linamii.co.za."
      );
    } finally {
      setSending(false);
    }
  }


  return (
    <div className="mx-auto max-w-5xl px-5 py-24 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-caramel/10 px-4 py-2 text-xs tracking-[0.2em] text-caramel uppercase">
          <Sparkles className="mr-2 size-4" /> Vendor Programme
        </div>
        <h1 className="mt-8 font-display text-5xl md:text-6xl">Sell With Us</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Make something beautiful for babies 0–12 months? Join the Linamii platform.
          We give you the storefront and the marketing.
        </p>
      </div>

      {/* How it works & Requirements */}
      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <InfoCard icon={<CheckCircle2 className="size-5 text-caramel" />} title="How it works">
          <ol className="ml-4 list-decimal space-y-3 text-sm leading-relaxed text-muted-foreground marker:text-caramel">
            <li>Apply with your business details, product range and images.</li>
            <li>We review for safety, quality and fit with babies 0–12 months.</li>
            <li>
              Approved vendors register on{" "}
              <a
                href="https://kasikonnect.online/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-caramel underline underline-offset-2"
              >
                KasiKonnect
              </a>{" "}
              and are onboarded to the platform.
            </li>
            <li>We build your storefront presence and run the marketing.</li>
            <li>You fulfil orders; payouts follow the agreed schedule.</li>
          </ol>
        </InfoCard>

        <InfoCard icon={<FileText className="size-5 text-caramel" />} title="Requirements">
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Products must be made for or suited to babies aged 0–12 months.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              A registered South African business or sole proprietor with valid contact details.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Consistent stock availability and agreed lead times.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Clear product photography and accurate descriptions.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Registration on KasiKonnect after approval, as part of our vendor partnership.
            </li>
          </ul>
        </InfoCard>
      </section>

      {/* Safety standards & Baby food compliance */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <InfoCard icon={<Shield className="size-5 text-caramel" />} title="Safety standards">
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              All materials must be non-toxic, BPA-free and safe for infants from birth.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Textiles should use OEKO-TEX certified or equivalent yarn and fabric.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No small detachable parts that present a choking hazard.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Flammability, seam strength and finish must be suitable for infant use.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Products may be requested for physical inspection before approval.
            </li>
          </ul>
        </InfoCard>

        <InfoCard icon={<Apple className="size-5 text-caramel" />} title="Baby food compliance">
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Baby food and consumables must comply with the Foodstuffs, Cosmetics and
              Disinfectants Act.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Full ingredient and allergen labelling is required on every unit.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Valid Certificate of Acceptability (COA) for the preparation premises.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Clear batch numbers, manufacture dates and expiry dates.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Cold-chain and storage requirements must be documented.
            </li>
          </ul>
        </InfoCard>
      </section>

      {/* South African regulations & Product restrictions */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <InfoCard
          icon={<Scale className="size-5 text-caramel" />}
          title="South African regulations"
        >
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Compliance with the Consumer Protection Act (CPA) for labelling, returns and
              product safety.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Compliance with POPIA for any customer personal information handled.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Valid business registration and tax details where applicable.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              Adherence to SABS/NRCS standards relevant to the product category.
            </li>
          </ul>
        </InfoCard>

        <InfoCard icon={<Ban className="size-5 text-caramel" />} title="Product restrictions">
          <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No second-hand or refurbished baby products.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No car seats, cots or sleep devices requiring regulated certification we cannot
              verify.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No medicines, supplements or medical devices.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No counterfeit, replica or unlicensed branded goods.
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-caramel" />
              No products with recalled components or unverified imported materials.
            </li>
          </ul>
        </InfoCard>
      </section>

      {/* KasiKonnect registration */}
      <section className="mt-6">
        <InfoCard
          icon={<Handshake className="size-5 text-caramel" />}
          title="KasiKonnect registration"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Linamii partners with{" "}
            <a
              href="https://kasikonnect.online/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-caramel underline underline-offset-2"
            >
              KasiKonnect
            </a>{" "}
            to onboard township and local vendors. Approved applicants complete KasiKonnect
            registration as part of onboarding, which covers vendor verification, payout
            details and platform support. Registering with KasiKonnect before approval is
            optional — you can also sign up at{" "}
            <a
              href="https://kasikonnect.online/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-caramel underline underline-offset-2"
            >
              kasikonnect.online
            </a>{" "}
            to grow your business network.
          </p>
        </InfoCard>
      </section>

      {/* Legal disclaimer */}
      <section className="mt-6">
        <InfoCard
          icon={<Info className="size-5 text-caramel" />}
          title="Legal disclaimer"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Submitting an application does not guarantee acceptance onto the Linamii
            platform. Vendors remain solely responsible for the safety, legality, labelling
            and compliance of their products, including all applicable South African
            legislation and standards. Linamii reserves the right to request documentation,
            inspect products, and suspend or remove any listing at its discretion. All
            vendor information is processed in accordance with POPIA.
          </p>
        </InfoCard>
      </section>

      {/* Application form */}
      <form
        onSubmit={onSubmit}
        className="mt-16 rounded-[2rem] bg-card p-8 shadow-[var(--shadow-soft)] md:p-12"
      >
        <h2 className="font-display text-2xl">Vendor Application</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete the form below and our team will review your application.
        </p>

        {/* Business details */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="registrationNumber" className="text-sm">
              Registration Number <span className="text-caramel">*</span>
            </Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              placeholder="Enter your company registration number"
              required
              maxLength={30}
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value.slice(0, 30))}
              className="mt-2 rounded-full bg-background"
            />
            <p className="mt-1.5 pr-1 text-right text-[11px] tracking-wide text-muted-foreground tabular-nums">
              {regNumber.length} / 30 characters
            </p>
            {regError && <p className="mt-1 text-xs text-destructive">{regError}</p>}
          </div>
          <CountedInput
            name="businessName"
            label={
              <>
                Registered Business Name <span className="text-caramel">*</span>
              </>
            }
            placeholder="e.g. Little Loom (Pty) Ltd"
            maxLength={120}
            required
          />
          <CountedInput
            name="contactName"
            label={
              <>
                Contact Person <span className="text-caramel">*</span>
              </>
            }
            placeholder="Full name"
            maxLength={100}
            required
          />
          <CountedInput
            name="email"
            label={
              <>
                Email Address <span className="text-caramel">*</span>
              </>
            }
            placeholder="you@company.co.za"
            type="email"
            inputMode="email"
            maxLength={255}
            required
          />
          <CountedInput
            name="phone"
            label={
              <>
                Phone Number <span className="text-caramel">*</span>
              </>
            }
            placeholder="+27 ..."
            type="tel"
            inputMode="tel"
            maxLength={20}
            required
          />
          <CountedInput
            name="productTypes"
            label={
              <>
                What do you sell? <span className="text-caramel">*</span>
              </>
            }
            placeholder="e.g. baby clothing, feeding sets"
            maxLength={200}
            required
          />
        </div>

        <CountedTextarea
          name="about"
          label="Tell us about your brand"
          placeholder="A short description of your brand and products"
          maxLength={1000}
          className="mt-6"
        />

        {/* Website section — compulsory */}
        <div className="mt-10 rounded-3xl border border-border bg-background p-6">
          <p className="text-sm font-medium">
            Do you have a website? <span className="text-caramel">*</span>
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="hasWebsite"
                checked={hasWebsite === "yes"}
                onChange={() => {
                  setHasWebsite("yes");
                  setWantsSynaps(false);
                }}
                className="accent-caramel"
              />
              Yes, I have a website
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="hasWebsite"
                checked={hasWebsite === "no"}
                onChange={() => setHasWebsite("no")}
                className="accent-caramel"
              />
              I do not have a website
            </label>
          </div>

          {hasWebsite === "yes" && (
            <CountedInput
              name="websiteUrl"
              label="Website URL"
              placeholder="https://yourstore.co.za"
              type="url"
              maxLength={255}
              required
              className="mt-5"
            />
          )}

          {hasWebsite === "no" && (
            <label className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
              <input
                type="checkbox"
                name="wantsSynaps"
                checked={wantsSynaps}
                onChange={(e) => setWantsSynaps(e.target.checked)}
                className="mt-0.5 accent-caramel"
              />
              <span>
                <Handshake className="mr-1 inline size-4 text-caramel" />
                I would like <strong>SYNAPS</strong> to build a website for my business.
              </span>
            </label>
          )}

          {websiteError && <p className="mt-3 text-xs text-destructive">{websiteError}</p>}
        </div>

        {/* Documents */}
        <div className="mt-10">
          <h3 className="font-display text-xl">Supporting Documents</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload the required documents below. Fields marked * are compulsory.
          </p>
          <div className="mt-5">
            <DocumentUpload value={docs} onChange={setDocs} />
          </div>
          {docsError && <p className="mt-3 text-sm text-destructive">{docsError}</p>}
        </div>

        <Button
          type="submit"
          variant="hero"
          size="pill"
          className="mt-10 h-12 w-full px-8 sm:w-auto"
          disabled={sending}
        >
          {sending ? "Submitting…" : "Submit Application"}

        </Button>
      </form>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
