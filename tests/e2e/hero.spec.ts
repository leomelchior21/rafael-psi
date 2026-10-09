import { test, expect } from '@playwright/test';

test('photographs cover the hero and all highlighted texts have equal rounded images', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-slide')).toHaveCount(3);
  const layout = await page.evaluate(() => {
    const hero = document.querySelector('.hero')!.getBoundingClientRect();
    const photo = document.querySelector('.hero-slide')!.getBoundingClientRect();
    const cards = [...document.querySelectorAll('.featured-card .image-frame')].map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      radius: parseFloat(getComputedStyle(element).borderRadius),
    }));
    return {
      hero: { width: hero.width, height: hero.height },
      photo: { width: photo.width, height: photo.height },
      cards,
    };
  });
  expect(layout.photo).toEqual(layout.hero);
  for (const card of layout.cards) {
    expect(card.width).toBeCloseTo(layout.cards[0].width, 0);
    expect(card.height).toBeCloseTo(layout.cards[0].height, 0);
    expect(card.radius).toBeGreaterThanOrEqual(10);
  }
  await expect(page.getByRole('button', { name: 'Pausar fotografias' })).not.toBeVisible();
});

test('only photographs rotate; pause and reduced motion suspend automatic changes', async ({
  page,
}) => {
  await page.goto('/');
  const photos = page.locator('.hero-photos');
  await expect(page.getByRole('button', { name: 'Pausar fotografias' })).toBeVisible();
  await page.waitForTimeout(1800);
  const brush = await page
    .locator('.hero-brush')
    .evaluate((element) => ({
      rect: element.getBoundingClientRect().toJSON(),
      transform: getComputedStyle(element).transform,
      clip: getComputedStyle(element).clipPath,
    }));
  await expect(photos).not.toHaveAttribute('data-active-slide', '0', { timeout: 12000 });
  expect(
    await page
      .locator('.hero-brush')
      .evaluate((element) => ({
        rect: element.getBoundingClientRect().toJSON(),
        transform: getComputedStyle(element).transform,
        clip: getComputedStyle(element).clipPath,
      })),
  ).toEqual(brush);
  await page.getByRole('button', { name: 'Pausar fotografias' }).click();
  const paused = await photos.getAttribute('data-active-slide');
  await page.waitForTimeout(7000);
  await expect(photos).toHaveAttribute('data-active-slide', paused!);
  await page.getByRole('button', { name: 'Retomar fotografias' }).click();
  await expect(photos).not.toHaveAttribute('data-active-slide', paused!, { timeout: 10000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await photos.getAttribute('data-active-slide');
  await page.waitForTimeout(7000);
  await expect(photos).toHaveAttribute('data-active-slide', reduced!);
  await expect(page.locator('.hero-brush')).toHaveCSS('clip-path', 'none');
});
