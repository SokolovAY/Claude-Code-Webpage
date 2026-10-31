import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface EmailFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  /** Error text. Announced politely and linked with aria-describedby. */
  error?: string;
  /** Helper text below the field, also linked with aria-describedby. */
  hint?: ReactNode;
}

export function EmailField({ id, label, error, hint, className, ...rest }: EmailFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={clsx(
          "min-h-11 w-full rounded-sm border-2 bg-paper px-4 py-2 text-base text-ink placeholder:text-ink-muted",
          error ? "border-error" : "border-ink",
        )}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <p id={errorId} aria-live="polite" className="text-sm font-semibold text-error empty:hidden">
        {error}
      </p>
    </div>
  );
}
