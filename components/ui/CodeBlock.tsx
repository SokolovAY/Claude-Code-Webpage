import clsx from "clsx";

export interface CodeBlockProps {
  lines: string[];
  title?: string;
  className?: string;
}

function lineClass(line: string): string {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#") || trimmed.startsWith("//")) return "text-term-comment";
  return "text-term-text";
}

/** Friendly terminal: dark monospace block. Jokes go in comments. Scrolls horizontally inside the block only. */
export function CodeBlock({ lines, title, className }: CodeBlockProps) {
  return (
    // min-w-0 lets the block shrink inside grid/flex parents so long lines scroll here, not the page.
    <figure
      className={clsx("min-w-0 overflow-hidden rounded-md bg-term-bg shadow-sticker", className)}
    >
      <div className="flex items-center gap-2 border-b border-term-text/10 px-4 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-pill bg-sticker-pink" />
          <span className="size-2.5 rounded-pill bg-term-accent" />
          <span className="size-2.5 rounded-pill bg-sticker-mint" />
        </span>
        {title ? (
          <figcaption className="truncate font-mono text-xs text-term-text">{title}</figcaption>
        ) : null}
      </div>
      {/* tabIndex makes the scrollable region reachable by keyboard. */}
      <pre
        tabIndex={0}
        aria-label={title}
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed"
      >
        <code>
          {lines.map((line, i) => {
            const prompt = line.startsWith("$ ");
            return (
              <span key={i} className={clsx("block", lineClass(line))}>
                {prompt ? (
                  <>
                    <span className="text-term-accent">$</span>
                    {line.slice(1)}
                  </>
                ) : (
                  line || " "
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
