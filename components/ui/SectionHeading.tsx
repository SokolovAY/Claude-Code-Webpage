import { Aside } from "./Aside";

export interface SectionHeadingProps {
  id: string;
  title: string;
  kicker?: string;
}

/** Section h2. scroll-mt keeps it visible below the sticky header after anchor jumps. */
export function SectionHeading({ id, title, kicker }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-1">
      {kicker ? <Aside>{kicker}</Aside> : null}
      <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight text-ink md:text-3xl">
        {title}
      </h2>
    </div>
  );
}
