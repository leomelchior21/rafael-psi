import { createClient } from 'next-sanity';
import { readFile } from 'node:fs/promises';
import { demoContent } from '../data/demo';
import type { EditorialPhoto } from '../src/lib/types';
async function readToken(): Promise<string> {
  if (!process.argv.includes('--stdin')) return process.env.SANITY_API_WRITE_TOKEN || '';
  process.stdin.setEncoding('utf8');
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdout.write('Ready for Sanity token on stdin (input is hidden).\n');
  return new Promise((resolve) => {
    let input = '';
    const handler = (chunk: string) => {
      input += chunk;
      if (/[\r\n]/.test(input)) {
        process.stdin.off('data', handler);
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve(input.trim());
      }
    };
    process.stdin.on('data', handler);
    process.stdin.resume();
  });
}
const token = await readToken();
if (!token)
  throw new Error(
    'Defina SANITY_API_WRITE_TOKEN em .env.local ou use --stdin. Nunca inclua o token no Git.',
  );
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'svrzh6fe',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-10-01',
  useCdn: false,
  token,
});
const imageCache = new Map<string, EditorialPhoto>();
async function upload(image?: EditorialPhoto) {
  if (!image?.localPath) return image;
  if (imageCache.has(image.localPath)) return imageCache.get(image.localPath)!;
  const asset = await client.assets.upload('image', await readFile(`public${image.localPath}`), {
    filename: image.localPath.split('/').pop(),
    contentType: 'image/webp',
  });
  const { localPath: _, ...fields } = image;
  void _;
  const result = {
    ...fields,
    _type: 'editorialImage',
    asset: { _type: 'reference' as const, _ref: asset._id },
  };
  imageCache.set(image.localPath, result);
  return result;
}
const ref = (id: string) => ({ _type: 'reference', _ref: id, _key: id });
async function seed() {
  // Verify project access before uploading. Never replace an existing document.
  const existing = await client.fetch<string[]>('*[_id in $ids]._id', {
    ids: [
      'siteSettings',
      'homePage',
      'clinicPage',
      'aboutPage',
      'contactPage',
      ...demoContent.articles.map((a) => a._id),
      ...demoContent.fragments.map((f) => f._id),
      ...demoContent.topics.map((t) => t._id),
    ],
  });
  const ids = new Set(existing);
  const docs: Record<string, unknown>[] = [];
  for (const topic of demoContent.topics) docs.push({ ...topic, _type: 'topic' });
  for (const article of demoContent.articles) {
    if (ids.has(article._id)) continue;
    docs.push({
      ...article,
      _type: 'article',
      topic: ref(article.topic!._id),
      heroImage: await upload(article.heroImage),
    });
  }
  for (const fragment of demoContent.fragments) {
    if (ids.has(fragment._id)) continue;
    docs.push({
      ...fragment,
      _type: 'fragment',
      topic: ref(fragment.topic!._id),
      image: await upload(fragment.image),
    });
  }
  if (!ids.has('siteSettings'))
    docs.push({ ...demoContent.settings, _id: 'siteSettings', _type: 'siteSettings' });
  if (!ids.has('homePage'))
    docs.push({
      ...demoContent.home,
      _id: 'homePage',
      _type: 'homePage',
      heroImage: await upload(demoContent.home.heroImage),
      clinicImage: await upload(demoContent.home.clinicImage),
      featuredArticles: demoContent.home.featuredArticles!.map((a) => ref(a._id)),
      featuredFragments: demoContent.home.featuredFragments!.map((f) => ref(f._id)),
    });
  if (!ids.has('clinicPage'))
    docs.push({
      ...demoContent.clinic,
      _id: 'clinicPage',
      _type: 'clinicPage',
      clinicImage: await upload(demoContent.clinic.clinicImage),
    });
  if (!ids.has('aboutPage'))
    docs.push({ ...demoContent.about, _id: 'aboutPage', _type: 'aboutPage' });
  if (!ids.has('contactPage'))
    docs.push({ ...demoContent.contact, _id: 'contactPage', _type: 'contactPage' });
  let transaction = client.transaction();
  for (const doc of docs)
    transaction = transaction.createIfNotExists(doc as { _id: string; _type: string });
  if (docs.length) await transaction.commit();
  console.log(
    `Importação concluída: ${docs.filter((d) => !ids.has(String(d._id))).length} documentos novos; documentos existentes preservados.`,
  );
}
seed().catch(() => {
  console.error(
    'A importação falhou. Verifique a conexão e as permissões do token para este projeto. Nenhum token foi registrado.',
  );
  process.exitCode = 1;
});
