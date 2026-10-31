import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Aside,
  Avatar,
  Button,
  Card,
  CodeBlock,
  EmailField,
  Highlight,
  ProductTile,
  SectionHeading,
  Tag,
} from "@/components/ui";
import { getServerEnv } from "@/lib/env";
import type { Product } from "@/lib/types";

/*
 * Design-system preview (CLAUDE.md section 7). Dev-only tool, not a user-facing page,
 * so its labels are inline instead of in content/strings.en.ts.
 */

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "paper", className: "bg-paper" },
  { name: "paper-deep", className: "bg-paper-deep" },
  { name: "ink", className: "bg-ink" },
  { name: "ink-muted", className: "bg-ink-muted" },
  { name: "highlight", className: "bg-highlight" },
  { name: "sticker-mint", className: "bg-sticker-mint" },
  { name: "sticker-pink", className: "bg-sticker-pink" },
  { name: "sticker-sky", className: "bg-sticker-sky" },
  { name: "term-bg", className: "bg-term-bg" },
  { name: "term-text", className: "bg-term-text" },
  { name: "term-comment", className: "bg-term-comment" },
  { name: "term-accent", className: "bg-term-accent" },
  { name: "focus", className: "bg-focus" },
  { name: "error", className: "bg-error" },
  { name: "success", className: "bg-success" },
] as const;

const typeScale = [
  { name: "5xl", className: "text-5xl" },
  { name: "4xl", className: "text-4xl" },
  { name: "3xl", className: "text-3xl" },
  { name: "2xl", className: "text-2xl" },
  { name: "xl", className: "text-xl" },
  { name: "lg", className: "text-lg" },
  { name: "base", className: "text-base" },
  { name: "sm", className: "text-sm" },
  { name: "xs", className: "text-xs" },
] as const;

const radii = [
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
  { name: "pill", className: "rounded-pill" },
] as const;

// PLACEHOLDER: preview-only sample data.
const sampleLive: Product = {
  id: "design-sample-live",
  slug: "design-sample-live",
  type: "bundle",
  status: "live",
  titleKey: "products.placeholderA.title",
  summaryKey: "products.placeholderA.summary",
  audienceKey: "products.placeholderA.audience",
  includes: ["product.includes.pdf", "product.includes.cheatSheet"],
  pricing: { model: "pay_what_you_want", currency: "USD", minimum: 300, suggested: 700 },
  preview: {
    title: "cheat-sheet.sh",
    lines: [
      "# step 1: make a home for the project",
      "$ python -m venv .venv",
      "$ pip install requests",
      "# step 2: pretend you read the docs",
      "$ python scrape.py --url https://example.com --output a-very-long-file-name-to-show-scrolling.csv",
    ],
  },
  provider: { name: "lemonsqueezy", variantEnvKey: "LS_VARIANT_DESIGN_SAMPLE" },
  sortOrder: 1,
};

const sampleHighlighted: Product = {
  ...sampleLive,
  id: "design-sample-highlighted",
  slug: "design-sample-highlighted",
  titleKey: "products.placeholderB.title",
  summaryKey: "products.placeholderB.summary",
  audienceKey: "products.placeholderB.audience",
};

function Group({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="py-12">
      <SectionHeading id={id} title={title} />
      {children}
    </section>
  );
}

export default function DesignPage() {
  if (process.env.NODE_ENV === "production" && !getServerEnv().enableDesignPage) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Design system</h1>
      <p className="mt-2 text-ink-muted">Every token and component variant. Dev only.</p>

      <Group id="colors" title="Colors">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colorTokens.map((token) => (
            <li key={token.name} className="flex flex-col gap-2">
              <span
                className={`h-16 rounded-md border border-ink/10 shadow-sticker ${token.className}`}
              />
              <code className="font-mono text-xs">--color-{token.name}</code>
            </li>
          ))}
        </ul>
      </Group>

      <Group id="type" title="Typography">
        <ul className="flex flex-col gap-3">
          {typeScale.map((step) => (
            <li key={step.name} className="flex items-baseline gap-4">
              <code className="w-12 shrink-0 font-mono text-xs text-ink-muted">{step.name}</code>
              <span className={`${step.className} min-w-0 truncate`}>
                Useful things, every step
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <p className="font-sans">Inter: body and headings.</p>
          <p>
            <Aside>Caveat: psst, start here</Aside>
          </p>
          <p className="font-mono text-sm">JetBrains Mono: $ python main.py</p>
          <p className="max-w-3xl text-ink-muted">
            Muted secondary text sits on paper at a contrast above 4.5:1, so it stays readable even
            when your screen brightness is set to “save battery at all costs”.
          </p>
        </div>
      </Group>

      <Group id="shape" title="Radii, shadow and tilt">
        <div className="flex flex-wrap items-center gap-6">
          {radii.map((radius) => (
            <div
              key={radius.name}
              className={`flex h-16 w-24 items-center justify-center bg-paper-deep shadow-sticker ${radius.className}`}
            >
              <code className="font-mono text-xs">{radius.name}</code>
            </div>
          ))}
          <div className="flex h-16 w-24 rotate-sticker-l items-center justify-center rounded-md bg-sticker-pink shadow-sticker">
            <code className="font-mono text-xs">tilt l</code>
          </div>
          <div className="flex h-16 w-24 rotate-sticker-r items-center justify-center rounded-md bg-sticker-sky shadow-sticker">
            <code className="font-mono text-xs">tilt r</code>
          </div>
        </div>
      </Group>

      <Group id="buttons" title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary button</Button>
          <Button as="a" href="#buttons">
            Primary link
          </Button>
          <Button as="a" href="#buttons" variant="secondary">
            Secondary link
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Group>

      <Group id="cards" title="Card">
        <div className="grid gap-6 md:grid-cols-2">
          <Card tone="paper">Card, tone paper.</Card>
          <Card tone="deep">Card, tone deep.</Card>
        </div>
      </Group>

      <Group id="tags" title="Tag">
        <div className="flex flex-wrap items-center gap-4">
          <Tag color="mint">Python</Tag>
          <Tag color="pink" tilt="l">
            AI
          </Tag>
          <Tag color="sky" tilt="r">
            Data architecture &amp; governance
          </Tag>
        </div>
      </Group>

      <Group id="text-accents" title="Highlight and Aside">
        <p className="max-w-3xl text-lg">
          Build it this weekend, <Highlight>every step included</Highlight>, no five extra tutorials
          required.
        </p>
        <p className="mt-4">
          <Aside>psst, start here</Aside>
        </p>
      </Group>

      <Group id="code" title="CodeBlock">
        <div className="max-w-3xl">
          <CodeBlock title={sampleLive.preview.title} lines={sampleLive.preview.lines} />
        </div>
      </Group>

      <Group id="section-heading" title="SectionHeading">
        <SectionHeading id="sample-heading" title="Who's writing this" kicker="psst, start here" />
      </Group>

      <Group id="email" title="EmailField">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <EmailField
            id="design-email"
            name="email"
            label="Email address"
            hint="One email when a new article is out."
          />
          <EmailField
            id="design-email-error"
            name="email-error"
            label="Email address"
            defaultValue="not-an-email"
            error="That doesn't look like an email address. Try again, I'll wait."
          />
        </div>
      </Group>

      <Group id="avatar" title="Avatar">
        <div className="flex flex-wrap items-end gap-6">
          <Avatar pose="waving" size="lg" />
          <Avatar pose="coffee" size="md" />
          <Avatar pose="confused" size="sm" />
        </div>
      </Group>

      <Group id="product-tile" title="ProductTile">
        <div className="grid gap-6 md:grid-cols-3">
          <ProductTile product={sampleLive} />
          <ProductTile product={sampleHighlighted} highlighted />
          <ProductTile />
        </div>
      </Group>
    </main>
  );
}
