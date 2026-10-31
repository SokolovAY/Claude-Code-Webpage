/**
 * Typed, validated environment access.
 *
 * - `publicEnv` is safe for client code. Each NEXT_PUBLIC_ variable is read
 *   with a literal `process.env.X` so Next.js can inline it at build time.
 * - `getServerEnv()` is server-only. Never import its result into a client
 *   component.
 * - `next.config.ts` calls `getServerEnv()` so a misconfigured environment
 *   fails `dev`, `build` and `start` with a clear message.
 */

const PAYMENT_PROVIDERS = ["mock", "lemonsqueezy"] as const;
const SIGNUP_PROVIDERS = ["stub"] as const;

export type PaymentProviderName = (typeof PAYMENT_PROVIDERS)[number];
export type SignupProviderName = (typeof SIGNUP_PROVIDERS)[number];

export interface ServerEnv {
  paymentProvider: PaymentProviderName;
  signupProvider: SignupProviderName;
  /** Set when paymentProvider is "lemonsqueezy". */
  lemonSqueezy?: {
    storeSubdomain: string;
    webhookSecret: string;
  };
  enableDesignPage: boolean;
}

type EnvSource = Record<string, string | undefined>;

const DEFAULT_SITE_URL = "http://localhost:3000";

function readValue(source: EnvSource, name: string): string | undefined {
  const value = source[name]?.trim();
  return value ? value : undefined;
}

export const publicEnv = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, ""),
  gaId: process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined,
} as const;

function readEnum<T extends string>(
  source: EnvSource,
  name: string,
  allowed: readonly T[],
  fallback: T,
  errors: string[],
): T {
  const value = readValue(source, name);
  if (value === undefined) return fallback;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  errors.push(`${name} must be one of: ${allowed.join(", ")} (got "${value}")`);
  return fallback;
}

/**
 * Returns the value of a per-product variant variable, for example
 * `LS_VARIANT_BUNDLE_A`. The name comes from `product.provider.variantEnvKey`.
 */
export function readVariantId(envKey: string, source: EnvSource = process.env): string | undefined {
  return readValue(source, envKey);
}

export function getServerEnv(source: EnvSource = process.env): ServerEnv {
  const errors: string[] = [];

  const paymentProvider = readEnum(source, "PAYMENT_PROVIDER", PAYMENT_PROVIDERS, "mock", errors);
  const signupProvider = readEnum(source, "SIGNUP_PROVIDER", SIGNUP_PROVIDERS, "stub", errors);

  let lemonSqueezy: ServerEnv["lemonSqueezy"];
  if (paymentProvider === "lemonsqueezy") {
    const storeSubdomain = readValue(source, "LS_STORE_SUBDOMAIN");
    const webhookSecret = readValue(source, "LS_WEBHOOK_SECRET");
    if (!storeSubdomain)
      errors.push("LS_STORE_SUBDOMAIN is required when PAYMENT_PROVIDER=lemonsqueezy");
    if (!webhookSecret)
      errors.push("LS_WEBHOOK_SECRET is required when PAYMENT_PROVIDER=lemonsqueezy");
    if (storeSubdomain && webhookSecret) lemonSqueezy = { storeSubdomain, webhookSecret };
  }

  const siteUrl = readValue(source, "NEXT_PUBLIC_SITE_URL");
  if (siteUrl && !URL.canParse(siteUrl)) {
    errors.push(`NEXT_PUBLIC_SITE_URL must be an absolute URL (got "${siteUrl}")`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n${errors.map((e) => `  - ${e}`).join("\n")}\nSee .env.example.`,
    );
  }

  return {
    paymentProvider,
    signupProvider,
    lemonSqueezy,
    enableDesignPage: readValue(source, "ENABLE_DESIGN_PAGE") === "true",
  };
}
