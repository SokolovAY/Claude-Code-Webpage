import clsx from "clsx";
import type { ReactNode } from "react";

export interface TagProps {
  color?: "mint" | "pink" | "sky";
  tilt?: "l" | "r" | "none";
  children: ReactNode;
  className?: string;
}

const colors = {
  mint: "bg-sticker-mint",
  pink: "bg-sticker-pink",
  sky: "bg-sticker-sky",
} as const;

const tilts = {
  l: "rotate-sticker-l",
  r: "rotate-sticker-r",
  none: "",
} as const;

export function Tag({ color = "mint", tilt = "none", children, className }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-block rounded-pill px-3 py-1 text-sm font-semibold text-ink shadow-sticker",
        colors[color],
        tilts[tilt],
        className,
      )}
    >
      {children}
    </span>
  );
}
