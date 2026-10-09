import { test, expect } from '@playwright/test';

test('compact fragments type one at a time over a photograph, with pause and reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('.fragments-section');
  await section.scrollIntoViewIfNeeded();
  const rotation = page.locator('.fragment-rotation');
  await expect(rotation).toHaveAttribute('data-writing', 'true');
  await expect(page.locator('.fragment-slide[data-active="true"]')).toHaveCount(1);
  const layout = await section.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const photo = element.querySelector('.fragment-background')!.getBoundingClientRect();
    const brush = getComputedStyle(element, '::before');
    return {
      height: rect.height,
      photoWidth: photo.width,
      photoHeight: photo.height,
      width: rect.width,
      mirrored: brush.transform,
    };
  });
  expect(layout.height).toBeLessThan(600);
  expect(layout.photoWidth).toBe(layout.width);
  expect(layout.photoHeight).toBe(layout.height);
  expect(layout.mirrored).toBe('matrix(1, 0, 0, -1, 0, 0)');
  const firstHeight = await section.evaluate((element) => element.getBoundingClientRect().height);
  await expect(rotation).toHaveAttribute('data-active-fragment', '1', { timeout: 12000 });
  expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBe(
    firstHeight,
  );
  await page.getByRole('button', { name: 'Pausar fragmentos' }).click();
  const paused = await page
    .locator('.fragment-slide[data-active="true"] .fragment-typed')
    .innerText();
  await page.waitForTimeout(6000);
  await expect(page.locator('.fragment-slide[data-active="true"] .fragment-typed')).toHaveText(
    paused,
  );
  await page.getByRole('button', { name: 'Retomar fragmentos' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(rotation).toHaveAttribute('data-writing', 'false');
  const index = await rotation.getAttribute('data-active-fragment');
  const full = await page.locator('.fragment-slide[data-active="true"] .sr-only').innerText();
  await expect(page.locator('.fragment-slide[data-active="true"] .fragment-typed')).toHaveText(
    full,
  );
  await page.waitForTimeout(6000);
  await expect(rotation).toHaveAttribute('data-active-fragment', index!);
  await expect(page.getByRole('button', { name: 'Pausar fragmentos' })).not.toBeVisible();
});
