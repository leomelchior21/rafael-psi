import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const output = 'artifacts/refinement';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
for (const width of [1440, 1280, 1024, 768, 430, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${output}/hero-${width}.png` });
  // Reveal each chapter before taking the full-page screenshot.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 600; top < height; top += 600) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1700);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    overflow: document.documentElement.scrollWidth > innerWidth,
    sections: [...document.querySelectorAll('main > section')].map((section) =>
      Math.round(section.getBoundingClientRect().height),
    ),
    images: [...document.querySelectorAll('main img')].map((image) => ({
      loaded: image.complete && image.naturalWidth > 0,
      width: Math.round(image.getBoundingClientRect().width),
    })),
  }));
  console.log(JSON.stringify(metrics));
  if (metrics.overflow || metrics.images.some((image) => !image.loaded))
    errors.push(`Layout or image issue at ${width}px`);
  if (width === 1440 || width === 390) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${output}/menu-${width}.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.goto('http://localhost:3000/textos/o-sujeito-na-cidade', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${output}/article-${width}.png`, fullPage: true });
  }
  await context.close();
}
await browser.close();
if (errors.length) throw new Error([...new Set(errors)].join('\n'));
