import type { StringKey } from "@/content/strings.en";

export type ProductStatus = "placeholder" | "draft" | "live" | "retired";

export interface Product {
  id: string;
  slug: string;
  type: "bundle";
  status: ProductStatus;
  titleKey: StringKey;
  summaryKey: StringKey;
  audienceKey: StringKey;
  includes: StringKey[];
  articleSlug?: string;
  pricing: {
    model: "pay_what_you_want";
    currency: "USD";
    /** Minor units (cents), display only. */
    minimum: number;
    /** Minor units (cents), display only. */
    suggested: number;
  };
  /** Cheat-sheet snippet for CodeBlock. */
  preview: { title: string; lines: string[] };
  image?: string;
  provider: { name: "lemonsqueezy"; variantEnvKey: string };
  sortOrder: number;
}

export interface Article {
  /** Must equal utm_campaign on Medium. */
  slug: string;
  title: string;
  summary: string;
  mediumUrl: string;
  topics: string[];
  featured: boolean;
  image?: string;
  /** ISO date. */
  publishedAt: string;
}
