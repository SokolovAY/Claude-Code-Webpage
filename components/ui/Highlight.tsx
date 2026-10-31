import type { ReactNode } from "react";

/** Highlighter mark behind inline text. Covers the lower part of the line so text stays legible. */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-linear-to-t from-highlight from-60% to-transparent to-60% box-decoration-clone px-1 text-inherit">
      {children}
    </mark>
  );
}
