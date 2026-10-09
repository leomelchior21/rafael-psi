import { test, expect } from '@playwright/test';

test('fixed header and fullscreen menu preserve scroll locking and keyboard focus', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForTimeout(1800);
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.site-header')).toHaveCSS('color', 'rgb(243, 240, 232)');
  expect(await page.locator('.hero').evaluate((hero) => hero.getBoundingClientRect().top)).toBe(0);
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await expect(page.locator('.site-header')).toHaveClass(/header-scrolled/);
  const trigger = page.getByRole('button', { name: 'Abrir menu' });
  await trigger.click();
  await expect(page.locator('.menu-dialog')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  const width = await page
    .locator('.menu-dialog')
    .evaluate((dialog) => dialog.getBoundingClientRect().width);
  expect(width).toBe(await page.evaluate(() => innerWidth));
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-dialog')).not.toBeVisible();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(trigger).toBeFocused();
});

test('reduced motion restores revealed content and uses native scrolling', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1800);
  // Toggle the preference while animations and scroll observers are already active.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveAttribute('data-smooth-scroll', 'true');
  for (const element of await page.locator('[data-reveal], [data-stagger] > *').all()) {
    await expect(element).toHaveCSS('opacity', '1');
    await expect(element).toHaveCSS('transform', 'none');
  }
  for (const frame of await page.locator('.image-frame').all()) {
    await expect(frame).toHaveCSS('clip-path', 'none');
  }
  await page.locator('.article-card-link').first().click();
  await expect(page.locator('.prose')).toBeVisible();
  await expect(page.locator('.site-header')).toHaveCSS('color', 'rgb(12, 12, 12)');
  await page.locator('.site-header .logo').click();
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.site-header')).toHaveCSS('color', 'rgb(243, 240, 232)');
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
});

test('the editorial content remains visible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.site-header')).toHaveCSS('color', 'rgb(243, 240, 232)');
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.article-card')).toHaveCount(3);
  await expect(page.locator('.clinic-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.fragment-background .image-frame')).toHaveCSS('clip-path', 'none');
  await context.close();
});
