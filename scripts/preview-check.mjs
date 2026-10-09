import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
for (const [name, width, height] of [
  ['desktop', 1440, 1050],
  ['mobile', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle',
    timeout: 120000,
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = 'eager';
    }
    await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => {})));
  });
  await page.screenshot({ path: `artifacts/home-${name}.png`, fullPage: true });
  console.log(
    JSON.stringify({
      name,
      status: response.status(),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      images: await page
        .locator('img')
        .evaluateAll((images) =>
          images.map((i) => ({ src: i.currentSrc, loaded: i.complete && i.naturalWidth > 0 })),
        ),
      errors,
    }),
  );
  await page.close();
}
const studio = await browser.newPage();
studio.on('pageerror', (error) => console.log('Studio error:', error.message));
await studio.goto('http://localhost:3000/studio', { waitUntil: 'networkidle', timeout: 120000 });
await studio
  .waitForFunction(() => document.body.innerText.trim().length > 10, {}, { timeout: 30000 })
  .catch(() => {});
await studio.screenshot({ path: 'artifacts/studio.png', fullPage: true });
console.log('Studio:', (await studio.locator('body').innerText()).slice(0, 600));
await browser.close();
