import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "paper" | "deep";
}

export function Card({ tone = "paper", className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-ink/10 p-6 shadow-sticker",
        tone === "paper" ? "bg-paper" : "bg-paper-deep",
        className,
      )}
      {...rest}
    />
  );
}
