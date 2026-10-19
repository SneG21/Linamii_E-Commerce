import { Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";

export type DocRequirement = {
  id: string;
  label: string;
  hint: string;
  multiple?: boolean;
  accept: string;
  required?: boolean;
};

export const DOC_REQUIREMENTS: DocRequirement[] = [
  {
    id: "cipc",
    label: "CIPC Registration Documents",
    hint: "PDF, DOC, DOCX, PNG or JPG",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    required: true,
    multiple: true,
  },
  {
    id: "proofOfResidence",
    label: "Proof of Residence",
    hint: "Not older than three months",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    required: true,
  },
  {
    id: "bankLetter",
    label: "Bank Confirmation Letter",
    hint: "Stamped letter from your bank",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    required: true,
  },
  {
    id: "directorIds",
    label: "Certified ID Copies of Directors",
    hint: "Upload one certified copy per director",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    required: true,
    multiple: true,
  },
  {
    id: "productLicenses",
    label: "Product Licenses",
    hint: "Where applicable (e.g. food or cosmetics)",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    multiple: true,
  },
  {
    id: "productImages",
    label: "Product Images",
    hint: "Clear photos of your products",
    accept: ".png,.jpg,.jpeg,.webp",
    required: true,
    multiple: true,
  },
];

export type DocFiles = Record<string, File[]>;

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

export function DocumentUpload({
  value,
  onChange,
}: {
  value: DocFiles;
  onChange: (next: DocFiles) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DOC_REQUIREMENTS.map((req) => (
        <DocSlot key={req.id} req={req} files={value[req.id] ?? []} onChange={(files) => onChange({ ...value, [req.id]: files })} />
      ))}
    </div>
  );
}

function DocSlot({
  req,
  files,
  onChange,
}: {
  req: DocRequirement;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const allowed = req.accept.split(",");

  function handle(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list);
    const bad = picked.filter((f) => !allowed.includes(extOf(f.name)));
    if (bad.length) {
      setError(`Unsupported file type: ${bad.map((f) => f.name).join(", ")}. Allowed: ${allowed.join(" ")}`);
      return;
    }
    setError(null);
    onChange(req.multiple ? [...files, ...picked] : picked.slice(0, 1));
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <p className="text-sm font-medium">
        {req.label}
        {req.required && <span className="ml-1 text-caramel">*</span>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{req.hint}</p>

      <input
        ref={inputRef}
        type="file"
        multiple={req.multiple}
        accept={req.accept}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs tracking-wide transition-colors hover:bg-secondary/70"
      >
        <Paperclip className="size-3.5" />
        {req.id === "productImages" ? "Upload Images" : req.multiple ? "Upload Files" : "Upload File"}
      </button>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-3 py-2 text-xs">
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
    </div>
  );
}
