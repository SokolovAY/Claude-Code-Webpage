import clsx from "clsx";
import type { ReactNode } from "react";

/** Handwritten accent for short asides only ("psst, start here"), never body text. */
export function Aside({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx("font-hand text-2xl leading-none text-ink-muted", className)}>
      {children}
    </span>
  );
}
