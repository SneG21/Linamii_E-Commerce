import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <p className="mt-1.5 pr-1 text-right text-[11px] tracking-wide text-muted-foreground tabular-nums">
      {value.toLocaleString("en-ZA")} / {max.toLocaleString("en-ZA")} characters
    </p>
  );
}

type Base = {
  name: string;
  label: ReactNode;
  maxLength: number;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function CountedInput({
  name,
  label,
  maxLength,
  defaultValue = "",
  required,
  placeholder,
  className,
  disabled,
  type = "text",
  inputMode,
}: Base & { type?: string; inputMode?: "text" | "tel" | "email" | "numeric" }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
        className="mt-2 rounded-full bg-background"
      />
      <Counter value={value.length} max={maxLength} />
    </div>
  );
}

export function CountedTextarea({
  name,
  label,
  maxLength,
  defaultValue = "",
  required,
  placeholder,
  className,
  disabled,
  rows = 4,
}: Base & { rows?: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm">
        {label}
      </Label>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
        className={cn("mt-2 rounded-3xl bg-background")}
      />
      <Counter value={value.length} max={maxLength} />
    </div>
  );
}
