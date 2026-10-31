import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps & {
  as?: "button";
  href?: never;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

type ButtonAsAnchor = BaseProps & {
  as: "a";
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href">;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-6 py-2.5 text-base font-semibold transition-colors duration-fast select-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper shadow-sticker hover:bg-ink-muted",
  secondary: "border-2 border-ink bg-transparent text-ink hover:bg-paper-deep",
};

function classesFor(variant: Variant = "primary", className?: string) {
  return clsx(base, variants[variant], className);
}

export function Button(props: ButtonProps) {
  if (props.as === "a") {
    const { as, variant, className, href, ...rest } = props;
    const classes = classesFor(variant, className);
    // Internal routes use next/link for prefetching; anchors and external URLs use <a>.
    if (href.startsWith("/")) return <Link href={href} className={classes} {...rest} />;
    return <a href={href} className={classes} {...rest} />;
  }

  const { as, variant, className, type = "button", ...rest } = props;
  return <button type={type} className={classesFor(variant, className)} {...rest} />;
}
