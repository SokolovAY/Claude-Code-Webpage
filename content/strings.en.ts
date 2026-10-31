/**
 * Every user-facing string, keyed (CLAUDE.md section 9).
 * Starting copy is verbatim from PRD section 7 and needs Andrei's review before launch.
 * Variables use {name} placeholders and are filled by t() in lib/content.ts.
 */
export const strings = {
  "site.tagline": "DIY with me: useful things built with Python and AI, every step included.",

  "hero.headline": "Useful things you can build this weekend.",
  "hero.subhead":
    "Step-by-step guides on Python and AI, written so you can finish the job without opening five other tutorials.",
  "hero.ctaPrimary": "Grab a cheat sheet",
  "hero.ctaSecondary": "Read the articles",

  "referral.greeting":
    "Fresh from “{title}”? The cheat-sheet version is right below. You've earned it.",

  "support.heading": "Support my writing and get something useful back",
  "support.intro":
    "Medium can't pay me: its payment provider doesn't do Montenegro. So instead of a tip jar, here's a deal. You name the price, I send you the PDF and the cheat sheet. Everyone wins, especially my coffee machine.",
  "support.freeNote":
    "Every article stays free on Medium. The bundle just saves you the scrolling.",

  "product.cardTemplate":
    "{articleTitle}: PDF + cheat sheet. The full article as a clean PDF, plus one page with just the steps and commands.",
  "product.priceHint":
    "Name your price at checkout. Minimum {min}, suggested {suggested}. Paying more is allowed and deeply appreciated.",
  "product.cta": "Get the bundle",
  "product.placeholder": "New bundle cooking. Check back soon.",
  "product.includesLabel": "What's inside",
  "product.includes.pdf": "PDF edition",
  "product.includes.cheatSheet": "One-page cheat sheet",

  "about.heading": "Who's writing this",
  "about.intro":
    "I'm Andrei. For 25+ years I've designed data systems for banks and large companies, where “it mostly works” gets you a very long meeting. Now I write guides on building useful things with Python and AI, every step included, because I can't stand tutorials that skip the hard part.",

  "articles.heading": "Start with these",
  "articles.cta": "Read on Medium",

  "signup.heading": "Get new guides by email",
  "signup.helper":
    "One email when a new article is out. No spam, no weekly digest I'd forget to write.",
  "signup.cta": "Notify me",
  "signup.success": "You're on the list. See you at the next article.",
  "signup.error": "That doesn't look like an email address. Try again, I'll wait.",
  "signup.label": "Email address",

  "consent.text":
    "Cookies, but only the boring analytics kind. They tell me which articles bring you here.",
  "consent.accept": "Fine by me",
  "consent.decline": "No thanks",

  "checkout.cancelled": "Changed your mind? No hard feelings. The articles are still free.",

  "thanks.body":
    "Payment received. My coffee machine thanks you personally. The download link is on its way to your inbox.",

  "notFound.body": "This page doesn't exist. Unlike my articles, it skipped the details.",
  "notFound.cta": "Back to the useful part",

  "footer.line": "Made with Python, AI, and an unreasonable amount of coffee.",

  "avatar.waving.alt": "Illustrated Andrei waving hello",
  "avatar.coffee.alt": "Illustrated Andrei raising a cup of coffee",
  "avatar.confused.alt": "Illustrated Andrei looking confused",

  // PLACEHOLDER: product copy until real bundles exist.
  "products.placeholderA.title": "Placeholder bundle A",
  "products.placeholderA.summary": "A fake bundle so the checkout flow can be tested.",
  "products.placeholderA.audience": "For anyone testing this page.",
  "products.placeholderB.title": "Placeholder bundle B",
  "products.placeholderB.summary": "Another fake bundle, now with 100% more placeholder.",
  "products.placeholderB.audience": "For anyone testing this page twice.",
} as const;

export type StringKey = keyof typeof strings;
