import { strings, type StringKey } from "@/content/strings.en";

export type { StringKey };

/** Looks up a string by key and fills {name} placeholders. Unknown placeholders stay as-is. */
export function t(key: StringKey, vars?: Record<string, string | number>): string {
  const template: string = strings[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Formats minor units (cents) as a currency string, e.g. 300 → "$3.00". */
export function formatPrice(minor: number, currency: string): string {
  const amount = minor / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
