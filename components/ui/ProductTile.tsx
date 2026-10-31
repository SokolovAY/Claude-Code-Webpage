import clsx from "clsx";
import { formatPrice, t } from "@/lib/content";
import type { Product } from "@/lib/types";
import { Aside } from "./Aside";
import { Button } from "./Button";
import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Tag } from "./Tag";

export interface ProductTileProps {
  /** Omit for an empty slot: renders the placeholder card. */
  product?: Product;
  highlighted?: boolean;
}

export function ProductTile({ product, highlighted = false }: ProductTileProps) {
  if (!product || product.status === "placeholder") {
    return (
      <Card
        tone="deep"
        className="flex min-h-48 items-center justify-center border-dashed text-center"
      >
        <p>
          <Aside>{t("product.placeholder")}</Aside>
        </p>
      </Card>
    );
  }

  const { pricing } = product;
  const titleId = `product-${product.id}-title`;

  return (
    <Card
      tone={highlighted ? "deep" : "paper"}
      aria-labelledby={titleId}
      role="group"
      className={clsx(
        "flex min-w-0 flex-col gap-4",
        highlighted && "rotate-sticker-r border-2 border-ink",
      )}
    >
      <h3 id={titleId} className="text-xl font-bold text-ink">
        {t(product.titleKey)}
      </h3>
      <p className="text-ink">{t(product.summaryKey)}</p>
      <div>
        <p className="text-sm font-semibold text-ink-muted">{t("product.includesLabel")}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {product.includes.map((key, i) => (
            <li key={key}>
              <Tag color={i % 2 === 0 ? "mint" : "sky"}>{t(key)}</Tag>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-ink-muted">{t(product.audienceKey)}</p>
      <CodeBlock title={product.preview.title} lines={product.preview.lines} />
      <p className="text-sm text-ink-muted">
        {t("product.priceHint", {
          min: formatPrice(pricing.minimum, pricing.currency),
          suggested: formatPrice(pricing.suggested, pricing.currency),
        })}
      </p>
      {product.status === "live" ? (
        // PLACEHOLDER (M1): replaced by CheckoutButton in M2.
        <Button data-testid={`checkout-${product.id}`} className="self-start">
          {t("product.cta")}
        </Button>
      ) : null}
    </Card>
  );
}
