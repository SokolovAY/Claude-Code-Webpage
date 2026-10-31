# CLAUDE.md

Implementation guide for Claude Code. The product source of truth is [docs/PRD.md](docs/PRD.md). Requirement IDs in this file (FR-…, NFR-…, SEO-…) point to it. If this file and the PRD disagree, stop and ask.

## 1. Project in one paragraph

A personal creator site for Andrei. Medium readers support him by buying pay-what-you-want article bundles (PDF + one-page cheat sheet) through Lemon Squeezy, because Stripe-based payouts don't work in Montenegro. Stage 1 is one mobile-first scrolling page (Hero, Support, About, Featured articles, Stay in touch, Footer), plus thank-you, legal and 404 pages. The code must be ready to grow into a creator hub (`/about`, `/articles`) and a shop (`/shop`) without a rebuild. Only stage 1 is in scope.

## 2. How to work

- **One milestone at a time.** Implement the current milestone from section 14, run lint, type-check, build and Playwright, then stop. Summarize what was done, what was tested, and anything skipped or open. Wait for approval before starting the next milestone.
- **Ask, don't guess,** when a requirement is unclear, conflicts with the PRD, or needs a decision listed as open (PRD section 18). Make small, reversible choices yourself and mention them in the summary.
- **Stay in scope.** No accounts, shop pages, subscriptions, CMS, database, i18n library, or extra languages. No new dependencies beyond section 4 without asking.
- **Never** commit secrets, put real legal text in as final, call live Lemon Squeezy mode, or add Vercel-only packages (`@vercel/analytics`, `@vercel/kv`, Edge Config…).
- **Git:** commit only when asked. Conventional commit messages (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).

## 3. Commands

Package manager: **npm**. The app lives in the project root. Platform: Windows (PowerShell); keep scripts cross-platform (no `rm -rf`, no inline `VAR=x` in npm scripts).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Production build (must pass with zero errors) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |
| `npm run test:e2e` | Playwright, headless, all projects |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:update` | Update visual baselines (`--update-snapshots`), only when a visual change is intended |

**Definition of done for any change:** `lint`, `typecheck`, `build` and `test:e2e` all pass.

## 4. Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (latest stable, ≥ 14) with App Router and `src/`-less layout |
| Language | TypeScript, `strict: true`, path alias `@/*` → project root |
| Styling | Tailwind CSS (version installed by `create-next-app`) |
| Fonts / images / scripts | `next/font`, `next/image`, `next/script` |
| Testing | `@playwright/test`, `@axe-core/playwright` |
| Lint / format | ESLint (Next config), Prettier + `prettier-plugin-tailwindcss` |
| Allowed extra deps | `clsx` (class merging). Anything else: ask first. |

Bootstrap (M0): `npx create-next-app@latest . --ts --tailwind --eslint --app --import-alias "@/*" --use-npm` (keep existing `docs/` and this file), then `npm init playwright@latest` (TypeScript, `tests/e2e`, no GitHub Actions yet).

## 5. Directory structure

```
app/
  layout.tsx              # root layout: fonts, metadata defaults, JSON-LD Person, Header, Footer, ConsentBar, Analytics
  page.tsx                # home: the six sections in order
  globals.css             # Tailwind + design tokens (CSS variables)
  not-found.tsx           # 404 (terminal style)
  thanks/page.tsx         # thank-you (noindex)
  privacy/page.tsx  terms/page.tsx  refunds/page.tsx
  design/page.tsx         # design-system preview, dev only (notFound() in production)
  api/subscribe/route.ts
  api/webhooks/lemonsqueezy/route.ts
  sitemap.ts  robots.ts
components/
  ui/                     # design-system components only (section 7.3)
  sections/               # Header, Hero, ReferralGreeting, Support, About, FeaturedArticles, StayInTouch, Footer
  consent/                # ConsentBar, ConsentProvider
  analytics/              # GoogleAnalytics (Consent Mode)
content/
  strings.en.ts           # every user-facing string, keyed (section 9)
  products.ts             # Product[] (section 8.1)
  articles.ts             # Article[] (section 8.1)
  site.ts                 # name, tagline, social links, contact, nav items
lib/
  content.ts              # t(key, vars) helper, formatPrice()
  payments/               # provider abstraction (section 10)
  signup/                 # signup abstraction (section 11)
  analytics/              # gtag wrapper, track(), consent helpers
  referral.ts             # utm_campaign parsing + session storage
  env.ts                  # typed, validated env access
public/
  avatar/                 # waving.svg, coffee.svg, confused.svg (placeholders until real art)
  og.png                  # 1200×630 social preview (placeholder)
tests/
  e2e/                    # Playwright specs
  fixtures/               # test helpers, consent/referral fixtures
playwright.config.ts
.env.example
```

## 6. Routes

| Route | Behavior |
| --- | --- |
| `/` | Scrolling home page. Section ids: `hero`, `support`, `about`, `articles`, `signup`. |
| `/support`, `/shop` | 307 redirect to `/#support` (via `redirects()` in `next.config`, `permanent: false`) |
| `/about` | 307 → `/#about` |
| `/articles` | 307 → `/#articles` |
| `/thanks` | Thank-you page, `robots: noindex`. Lemon Squeezy redirects here after purchase. |
| `/privacy`, `/terms`, `/refunds` | Legal pages |
| `/design` | Design-system preview. Returns 404 when `NODE_ENV === "production"` unless `ENABLE_DESIGN_PAGE=true`. |
| `/api/subscribe` | POST, signup (section 11) |
| `/api/webhooks/lemonsqueezy` | POST, order webhook (section 10.4) |
| anything else | `not-found.tsx` with HTTP 404 |

All pages are statically generated. Only the two API routes run on the server.

## 7. Design system

Build this in M1, before any page. Pages and sections use **only** these tokens and components.

### 7.1 Visual direction

- **Sticker notebook** (everything except code): warm off-white paper, dark ink text, one readable sans-serif for body and headings, highlighter marks on key phrases, rounded sticker tags with a slight tilt, handwritten accent font only for short asides ("psst, start here"), dark rounded primary button.
- **Friendly terminal** (code only): code snippets, cheat-sheet previews and the 404 page use a dark monospace style. Jokes appear as code comments.
- **Avatar:** illustrated, three poses: waving (hero), coffee (thank-you), confused (404). Use simple placeholder SVGs until the real art arrives.

### 7.2 Tokens

Define tokens as CSS variables in `app/globals.css` and expose them to Tailwind:
- **Tailwind v4** (CSS-first): in an `@theme` block.
- **Tailwind v3:** in `tailwind.config.ts` `theme.extend`, referencing the CSS variables.

Starting values (adjustable in review; keep the names):

| Token | Value | Use |
| --- | --- | --- |
| `--color-paper` | `#FBF7EF` | Page background |
| `--color-paper-deep` | `#F3ECDD` | Cards, alternating sections |
| `--color-ink` | `#1E1B18` | Body text, primary button |
| `--color-ink-muted` | `#5A534B` | Secondary text (must stay ≥ 4.5:1 on paper) |
| `--color-highlight` | `#FFE066` | Highlighter mark behind text |
| `--color-sticker-mint` | `#BDE8D4` | Tags |
| `--color-sticker-pink` | `#F9C6D0` | Tags |
| `--color-sticker-sky` | `#C4DDF7` | Tags |
| `--color-term-bg` | `#1D1F21` | Terminal background |
| `--color-term-text` | `#E6E1D6` | Terminal text |
| `--color-term-comment` | `#8FBF8F` | Code comments (jokes) |
| `--color-term-accent` | `#F0C674` | Prompt, strings |
| `--color-focus` | `#2F6FEB` | Focus ring |
| `--color-error` | `#B42318` | Errors |
| `--color-success` | `#1F7A4D` | Success |

- **Fonts** (via `next/font/google`, self-hosted at build): sans **Inter** (body and headings), handwritten **Caveat** (asides only), mono **JetBrains Mono** (terminal).
- **Type scale:** `xs 0.75rem`, `sm 0.875rem`, `base 1rem` (body, line-height 1.6), `lg 1.125rem`, `xl 1.25rem`, `2xl 1.5rem`, `3xl 1.875rem`, `4xl 2.25rem`, `5xl 3rem`. Headings step down one size on mobile.
- **Spacing:** Tailwind's default 4 px scale. Section vertical padding `py-16` mobile, `py-24` desktop. Content max width `max-w-3xl` for text, `max-w-5xl` for grids.
- **Radii:** `sm 6px`, `md 12px`, `lg 20px`, `pill 9999px`.
- **Shadows:** `sticker` = `2px 3px 0 rgba(30,27,24,0.15)`.
- **Tilt:** `rotate-sticker-l` = `-2deg`, `rotate-sticker-r` = `1.5deg`. Tags and tiles only, never body text.
- **Breakpoints:** Tailwind defaults (`sm 640`, `md 768`, `lg 1024`). Design at 390 px first.

**Rule:** no arbitrary values (`bg-[#...]`, `p-[13px]`) and no raw hex colors outside `globals.css` and `components/ui/`.

### 7.3 Components (`components/ui/`)

| Component | Props / variants | Notes |
| --- | --- | --- |
| `Button` | `variant: "primary" \| "secondary"`, `as: "button" \| "a"`, `href?` | Primary: ink background, paper text, `rounded-pill`, ≥ 44 px tall. Visible focus ring. |
| `Card` | `tone: "paper" \| "deep"` | Rounded, subtle sticker shadow. |
| `Tag` | `color: "mint" \| "pink" \| "sky"`, `tilt?: "l" \| "r" \| "none"` | Sticker look. |
| `ProductTile` | `product: Product`, `highlighted?: boolean` | Card + includes list + cheat-sheet preview (`CodeBlock`) + price hint + `CheckoutButton`. Placeholder status: shows placeholder copy, no button. |
| `CodeBlock` | `lines: string[]`, `title?` | Terminal style, monospace, horizontal scroll inside the block only. |
| `Highlight` | children | Highlighter mark behind inline text. |
| `Aside` | children | Handwritten accent, short text only. |
| `SectionHeading` | `id`, `title`, `kicker?` | Consistent `h2` with scroll margin for the sticky header. |
| `EmailField` | `label`, `error?` | Labelled input with error text linked via `aria-describedby`. |
| `Avatar` | `pose: "waving" \| "coffee" \| "confused"`, `size` | `next/image`, fixed dimensions (no layout shift), alt text from strings. |

`/design` renders every token and every component variant.

## 8. Content and data

All content is typed TypeScript in `content/`. Pages read it at build time. Adding a bundle or article must never require a component change (FR-ADM-1).

### 8.1 Types (`lib/types.ts` or alongside content)

```ts
export type ProductStatus = "placeholder" | "draft" | "live" | "retired";

export interface Product {
  id: string;                 // "bundle-python-scraper"
  slug: string;
  type: "bundle";             // later: "guide" | "template" | ...
  status: ProductStatus;
  titleKey: string;           // keys into strings.en.ts
  summaryKey: string;
  audienceKey: string;
  includes: string[];         // string keys
  articleSlug?: string;
  pricing: {
    model: "pay_what_you_want";
    currency: "USD";
    minimum: number;          // minor units (cents), display only
    suggested: number;        // minor units, display only
  };
  preview: { title: string; lines: string[] };   // cheat-sheet snippet for CodeBlock
  image?: string;
  provider: { name: "lemonsqueezy"; variantEnvKey: string };  // e.g. "LS_VARIANT_BUNDLE_PYTHON_SCRAPER"
  sortOrder: number;
}

export interface Article {
  slug: string;               // must equal utm_campaign on Medium
  title: string;
  summary: string;
  mediumUrl: string;
  topics: string[];
  featured: boolean;
  image?: string;
  publishedAt: string;        // ISO date
}
```

- Only `status: "live"` products show a checkout button. Only `"placeholder"` and `"live"` are rendered. Sort by `sortOrder`.
- Show 3 card slots in the support block. Fill empty slots with the placeholder card (FR-SUP-8).
- Prices are display-only. Lemon Squeezy enforces the real minimum and collects the price on its checkout page. **The site never sends a price.**
- `formatPrice(minor, currency)` uses `Intl.NumberFormat("en-US", { style: "currency", currency })`.

### 8.2 Placeholder content (M2)

- `products.ts`: two products with obvious fake titles ("Placeholder bundle A/B"), `status: "live"` so the checkout flow can be exercised, minimum $3, suggested $7, `variantEnvKey` `LS_VARIANT_BUNDLE_A/B`. Bundle A links to `placeholder-article-1`. With the mock provider they check out to `/thanks?mock=1`. The third slot is empty, so the "New bundle cooking" card shows.
- `articles.ts`: three featured placeholder articles with slugs `placeholder-article-1..3` and `mediumUrl` to `https://medium.com/`.
- Mark every placeholder with a `// PLACEHOLDER` comment so they're easy to find.

## 9. Copy and voice

- Every user-facing string lives in `content/strings.en.ts` as a flat object with dotted keys (`"hero.headline"`). Components call `t("hero.headline")` or `t("referral.greeting", { title })`. **No hard-coded UI text in components** (NFR-I18N).
- Copy the starting text and keys **verbatim** from PRD section 7. Tagline: "DIY with me: useful things built with Python and AI, every step included."
- Voice: more value, less padding; beginner-friendly, no jargon; humorous, sometimes sarcastic.
- **Hard rule (store approval):** never frame a payment as a donation, tip or sponsorship. The words "donate", "donation", "tip" (as the thing being paid for) and "sponsor" must not appear as calls to action. "Instead of a tip jar" in `support.intro` is allowed. A Playwright test enforces this.
- Alt text, aria-labels and the page `<title>`/description are also strings.

## 10. Payments (`lib/payments/`)

Pages and components import only from `@/lib/payments`. Nothing outside this folder knows about Lemon Squeezy.

### 10.1 Interface

```ts
export interface CheckoutContext { article?: string; bundle: string }

export interface PaymentProvider {
  /** Server-side: base checkout URL for a product, or null if not configured. */
  getCheckoutUrl(product: Product): string | null;
  /** Client-side: add context (article, bundle) to a base URL. */
  withContext(baseUrl: string, ctx: CheckoutContext): string;
  /** Server-side: verify a webhook and normalize it. */
  verifyWebhook(rawBody: string, headers: Headers): Promise<boolean>;
  parseOrderEvent(payload: unknown): Order | null;
}

export interface Order {
  id: string; productId: string; variantId: string;
  amount: number; currency: string; article?: string; bundle?: string; createdAt: string;
}
```

Implementations: `lemonsqueezy.ts` and `mock.ts`. `PAYMENT_PROVIDER` env (`lemonsqueezy` | `mock`, default `mock`) selects one.

### 10.2 Lemon Squeezy specifics

- Checkout URL: `https://{LS_STORE_SUBDOMAIN}.lemonsqueezy.com/buy/{variantId}` where `variantId = process.env[product.provider.variantEnvKey]`.
- `withContext` appends `checkout[custom][article]=<slug>` and `checkout[custom][bundle]=<productId>`, URL-encoded. Use `article=none` when there's no referral and the product has no article.
- Overlay: load `https://app.lemonsqueezy.com/js/lemon.js` with `next/script` (`lazyOnload`) and open with `window.LemonSqueezy.Url.Open(url)` plus `embed=1`. If `lemon.js` isn't available (blocked, in-app browser quirk), navigate to the hosted checkout URL instead (FR-SUP-7).
- Use `LemonSqueezy.Setup({ eventHandler })` to detect `Checkout.Success`. Check the current lemon.js docs for a close event to drive the "checkout cancelled" message (FR-CO-3). If there isn't one, show the message when the overlay closes without success.
- Product redirect URL (set in the Lemon Squeezy dashboard): `${NEXT_PUBLIC_SITE_URL}/thanks`.
- Test mode only until go-live. Never point at live mode.

### 10.3 Mock provider (default for local work)

- `getCheckoutUrl` returns `/thanks?mock=1` for `live` products.
- The button behaves exactly like the real one (fires analytics, appends context) so tests cover the full flow without the network.

### 10.4 Webhook route

`POST /api/webhooks/lemonsqueezy`:
- Read the raw body. Verify the `X-Signature` header as the hex HMAC-SHA256 of the raw body with `LS_WEBHOOK_SECRET`, using a timing-safe compare. Return 401 if invalid.
- Handle `order_created` only. Log a normalized `Order` with `console.info` (no buyer email or name). Return 200 for everything else.
- Priority S (FR-ADM-3): build it in M3, but it must not block anything.

### 10.5 CheckoutButton (client component)

On click:
1. Build the context: referral article from `lib/referral.ts`, else the product's `articleSlug`, else `"none"`.
2. `track("checkout_click", { article, bundle: product.id })`.
3. `withContext(baseUrl, ctx)`, then open the overlay or hosted checkout.

Label `t("product.cta")`. `data-testid="checkout-{productId}"`.

## 11. Signup (`lib/signup/`)

```ts
export type SignupSource = "home" | "thanks";
export interface SignupRequest { email: string; source: SignupSource; article?: string; consentAt: string }
export type SignupResult =
  | { ok: true; status: "subscribed" | "pending_confirmation" | "already_subscribed" }
  | { ok: false; error: "invalid_email" | "rate_limited" | "provider_error" };
export interface SignupProvider { subscribe(req: SignupRequest): Promise<SignupResult> }
```

- `stub.ts`: validates, `console.info`s the request in development, returns `{ ok: true, status: "subscribed" }`. Stores nothing.
- `SIGNUP_PROVIDER` env (`stub` default). A real provider is added later as one new file. Don't pick or install one.
- `POST /api/subscribe` (JSON `{ email, source, article?, website }`):
  - `website` is a honeypot. If filled, return 200 with a fake success and do nothing.
  - Validate the email server-side; invalid returns 400 `invalid_email`.
  - Simple in-memory rate limit per IP (e.g. 5/min); exceeded returns 429. Document that it resets per server instance.
- Form (client): client-side validation first; inline error `t("signup.error")`; success `t("signup.success")`; no page reload; helper text links to `/privacy`. Fire `track("sign_up", { method: "email" })` on success.

## 12. Referral, consent and analytics

### 12.1 Referral (`lib/referral.ts`)

- Read `utm_campaign` from the URL on the client. Accept it only if it matches `^[a-z0-9-]{1,80}$` **and** equals a known `Article.slug`. Otherwise ignore it silently and never render raw query text (FR-REF-2).
- Store a valid slug in `sessionStorage` key `ref.article` (wrap access in try/catch). Read it back on later in-page actions (FR-REF-4).
- `ReferralGreeting` is a client component inside `<Suspense>` (required for `useSearchParams` on a static page). It renders `t("referral.greeting", { title })` or nothing.
- If the referring article has a live product, pass `highlighted` to that tile and sort it first (FR-REF-3).

### 12.2 Consent (`components/consent/`)

- Store the choice in `localStorage` key `consent.v1` as `{ analytics: "granted" | "denied", at: ISO }`. It expires after 12 months. Wrap storage access in try/catch.
- `ConsentBar`: fixed bottom bar, notebook style, small. Text `consent.text`, buttons `consent.accept` / `consent.decline`. Shown to everyone (PRD Q7 still open; simplest compliant default). Never full-screen. While visible, add bottom padding to `<body>` equal to its height so no "Get the bundle" button is covered (FR-CONS-1).
- Footer "Cookie settings" link reopens the bar (FR-FOOT-2).
- Checkout and signup work regardless of choice (FR-CONS-5).

### 12.3 GA4 (`components/analytics/`, `lib/analytics/`)

- Load only when `NEXT_PUBLIC_GA_ID` is set.
- Before `gtag.js`, run an inline script that sets Consent Mode v2 defaults: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` all `"denied"`. Load `gtag/js` with `next/script` `afterInteractive`. On accept: `gtag("consent", "update", { analytics_storage: "granted" })`. Ad signals stay denied.
- `track(name, params)` pushes to `window.dataLayer` through `gtag("event", …)`. It's a safe no-op when GA isn't loaded.
- Events: `checkout_click { article, bundle }` (key event, set in the GA4 UI), `sign_up { method }`, `checkout_cancelled { bundle }` (optional).
- No GA cookies before consent. This is tested.

## 13. SEO, accessibility, performance, security

**SEO** (Metadata API):
- `metadataBase` from `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`).
- Unique title and description per page.
- Open Graph and Twitter tags with `/og.png`.
- `alternates.canonical` without query strings.
- `/thanks`, `/design` and 404 are `noindex`.
- `sitemap.ts` lists `/`, `/privacy`, `/terms`, `/refunds`. `robots.ts` points to it.
- JSON-LD `Person` (name, image, url, `sameAs` Medium + LinkedIn from `content/site.ts`) in the root layout.

**Accessibility** (WCAG 2.2 AA):
- Semantic landmarks, one `h1`, ordered headings.
- Skip link to main content.
- Everything keyboard operable with a visible focus ring.
- Touch targets ≥ 44 × 44 px.
- Labelled form fields, errors announced (`aria-live="polite"`).
- `prefers-reduced-motion` disables smooth scroll.
- Contrast passes for all token pairs used for text.

**Performance:**
- Server Components by default. `"use client"` only for CheckoutButton, ReferralGreeting, signup form, consent and analytics.
- Fonts via `next/font`. Hero avatar `priority` with fixed size.
- No layout shift from the consent bar or greeting (reserve space or render below the fold).
- Targets: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on mobile.

**Mobile layout:**
- The top of `#support` must be ≤ 2 × viewport height from page top at 390 × 844 (FR-SUP-1). Keep the hero compact on mobile.
- No horizontal scroll at 320 px.
- Sticky header with `scroll-margin-top` on sections.

**Security headers** (`next.config` `headers()`):
- `Content-Security-Policy` allowing self, `https://www.googletagmanager.com`, `https://www.google-analytics.com`, `https://*.lemonsqueezy.com`, `https://app.lemonsqueezy.com` (script, frame, connect, img as needed).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` minimal.
- HSTS in production only.

**Portability:** must run with `npm run build && npm run start` on any Node host and locally.

## 14. Milestones

Do one milestone, verify, report, stop.

### M0 · Foundations
- Bootstrap Next.js + TS + Tailwind + ESLint in the project root (section 4). Add Prettier with the Tailwind plugin, `typecheck` and test scripts.
- Create the folder skeleton (section 5), `lib/env.ts`, `.env.example`, `.gitignore` (including `.env*.local`, `playwright-report/`, `test-results/`).
- Install Playwright and configure the projects (section 15).
- Add one smoke test: home returns 200 and has an `h1`.
- `git init` if not already a repo (don't commit unless asked).
- **Exit:** `dev`, `build`, `lint`, `typecheck` and the smoke test pass.

### M1 · Design system
- Tokens (7.2), fonts, all components (7.3), `/design` page.
- **Exit:** `/design` shows everything; axe passes on `/design`; visual baselines recorded.

### M2 · Page with placeholders
- `content/` files with all strings from PRD section 7, placeholder products and articles.
- Header (2 to 3 nav links, room for 5), the six sections, ReferralGreeting, 404, `/thanks`, legal page shells, reserved route redirects.
- CheckoutButton with the **mock** provider.
- Legal pages contain a clear "Draft – not legal advice, to be reviewed" notice and section headings from PRD FR-LEGAL-2 only. Don't invent legal terms.
- **Exit:** Playwright for navigation, routes, referral, bundle cards, support position, 404, copy rule and axe all pass.

### M3 · Integrations (test mode, local)
- Lemon Squeezy provider + lemon.js overlay with fallback, webhook route, signup wrapper + stub + `/api/subscribe`, consent bar, GA4 with Consent Mode, SEO metadata, sitemap, robots, JSON-LD, security headers.
- **Exit:** full Playwright suite passes; a manual test-mode purchase works when env vars are set (report if not tested).

M4–M6 (real content, legal, email provider, domain, store approval, go-live) are mostly Andrei's tasks. Support them when asked. See PRD section 15.

## 15. Testing (Playwright)

- `playwright.config.ts`:
  - `testDir: "tests/e2e"`.
  - `webServer`: `npm run build && npm run start`, port 3000, `reuseExistingServer: !process.env.CI`, env `PAYMENT_PROVIDER=mock`, `SIGNUP_PROVIDER=stub`, `NEXT_PUBLIC_GA_ID=G-TEST`.
  - `use.baseURL` from `PLAYWRIGHT_BASE_URL`, falling back to `http://localhost:3000`.
  - `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"`.
- **Projects:** `mobile-safari` (iPhone 13), `mobile-chrome` (Pixel 7), `narrow` (Chromium 320 × 640), `desktop-chrome`, `desktop-firefox`, `desktop-webkit` (1280 × 800). Visual snapshots only on `mobile-safari` and `desktop-chrome`.
- **Network:** block and assert on `googletagmanager.com` / `google-analytics.com` and `lemonsqueezy.com` with `page.route()`. Tests never make real payments or reach Google.
- **Selectors:** prefer `getByRole` / `getByLabel`; use `data-testid` for checkout buttons and the consent bar.
- **Required specs** (one file per area):

| Spec | Covers |
| --- | --- |
| `home.spec.ts` | Sections present in order; hero CTAs jump to anchors; header links |
| `routes.spec.ts` | `/support` `/shop` `/about` `/articles` redirects; 404 status and page |
| `referral.spec.ts` | Known slug shows greeting; unknown/missing/`<script>` slug shows none and no raw text; slug kept after navigation; matching bundle highlighted |
| `support.spec.ts` | `#support` top ≤ 2 viewport heights (mobile projects); cards from data; placeholder has no button; price hint shows min and suggested |
| `checkout.spec.ts` | Click builds URL with `checkout[custom][article]` and `[bundle]`; `checkout_click` pushed to `dataLayer` after consent; mock reaches `/thanks` |
| `consent.spec.ts` | Bar visible, doesn't overlap any checkout button; no `_ga` cookie and no GA request before accept; accept/decline remembered; "Cookie settings" reopens; checkout works after decline |
| `signup.spec.ts` | Invalid shows error copy; valid shows success; honeypot; API 400/429 |
| `webhook.spec.ts` | Valid signature 200; invalid 401 (via `request` fixture) |
| `seo.spec.ts` | Titles, descriptions, OG, canonical without UTM, JSON-LD Person, sitemap, robots, noindex pages |
| `a11y.spec.ts` | axe on every page: no serious/critical violations; keyboard path to first checkout button |
| `copy.spec.ts` | Forbidden donation wording absent from rendered CTAs and headings |
| `visual.spec.ts` | `toHaveScreenshot()` for home, 404, `/thanks`, `/design` |

**Not covered by Playwright** (manual, report as such): the Medium in-app browser on real devices, the timed under-a-minute purchase on a real phone, and Lighthouse performance.

## 16. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=                  # empty = GA disabled
PAYMENT_PROVIDER=mock               # mock | lemonsqueezy
LS_STORE_SUBDOMAIN=
LS_WEBHOOK_SECRET=
LS_VARIANT_BUNDLE_A=                # one per product, name = product.provider.variantEnvKey
LS_VARIANT_BUNDLE_B=
SIGNUP_PROVIDER=stub                # stub | <future provider>
ENABLE_DESIGN_PAGE=false
```

`lib/env.ts` reads and validates these and fails the build with a clear message if a required variable is missing for the selected provider. Never expose non-`NEXT_PUBLIC_` values to client code.

## 17. Open decisions (don't decide these; use the defaults noted)

| PRD # | Topic | Default until decided |
| --- | --- | --- |
| Q2 | Domain | `NEXT_PUBLIC_SITE_URL` = localhost |
| Q3 | Email provider | Stub provider |
| Q4 | Real prices | Placeholders: USD, min $3, suggested $7 |
| Q6 | Overlay vs hosted checkout | Overlay with hosted fallback |
| Q7 | Consent bar audience | Show to everyone |
| Q8 | Launch articles | Placeholders |
| Q9 | Footer contact method | LinkedIn + Medium links only; `site.ts` has an empty `contactEmail` slot |
| Q10 | Tagline | Option 1 |
