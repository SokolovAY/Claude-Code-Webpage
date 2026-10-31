import { expect, test } from "@playwright/test";

// Runs only on mobile-safari and desktop-chrome (see playwright.config.ts).
// Home, 404 and /thanks baselines are added in M2.
test("design page", async ({ page }) => {
  await page.goto("/design");
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Full-page screenshots don't scroll, so lazy images below the fold would stay blank.
    await Promise.all(
      Array.from(document.images, (img) => {
        img.loading = "eager";
        return img.decode().catch(() => undefined);
      }),
    );
  });
  await expect(page).toHaveScreenshot("design.png", { fullPage: true });
});
