import { test, expect } from '@playwright/test';
test('editorial reading flow, topic filters and mobile menu', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Psicanálise, cidade e palavra' })).toBeVisible();
  await expect(page.locator('.article-card')).toHaveCount(3);
  await expect(page.locator('.fragment-card')).toHaveCount(2);
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page
      .getByRole('navigation', { name: 'Menu completo' })
      .getByRole('link', { name: 'Textos' })
      .click();
  } else {
    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Textos', exact: true })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'Textos', exact: true, level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Cidade', exact: true }).click();
  await expect(page.locator('.article-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'O sujeito na cidade' }).click();
  await expect(page.locator('.prose')).toContainText('Uma cidade não se resume');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/textos\/o-sujeito-na-cidade$/,
  );
});
test('search finds accented content and dialogs close with Escape', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Buscar no arquivo' }).click();
  } else {
    await page.getByRole('button', { name: 'Buscar no site' }).click();
  }
  await page.getByRole('searchbox').fill('repeticao');
  await expect(page.locator('.search-results')).toContainText('Tempo e repetição');
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-dialog')).not.toBeVisible();
});
test('every public route renders, images resolve and layout does not overflow', async ({
  page,
}) => {
  for (const path of [
    '/',
    '/textos',
    '/fragmentos',
    '/clinica',
    '/sobre',
    '/contato',
    '/creditos',
    '/privacidade',
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
  }
  await page.goto('/');
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('img'))
      .filter((i) => i.loading !== 'lazy')
      .every((i) => i.complete && i.naturalWidth > 0),
  );
});
test('placeholder contact never claims delivery and invalid article returns 404', async ({
  page,
}) => {
  await page.goto('/contato');
  await page.getByLabel('Nome', { exact: true }).fill('Maria');
  await page.getByLabel('E-mail ou WhatsApp').fill('maria@example.org');
  await page.getByLabel('Mensagem', { exact: true }).fill('Gostaria de saber sobre atendimento.');
  await page.getByRole('button', { name: 'Preparar mensagem' }).click();
  await expect(page.getByRole('status')).toContainText('Nenhuma mensagem foi enviada');
  const response = await page.goto('/textos/nao-existe');
  expect(response?.status()).toBe(404);
});
