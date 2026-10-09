import { NextResponse } from 'next/server';
import { getArticles, getFragments } from '@/lib/content';
import { normalize } from '@/lib/utils';
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim().slice(0, 120) || '';
  if (q.length < 2) return NextResponse.json([]);
  try {
    const [articles, fragments] = await Promise.all([getArticles(), getFragments()]);
    const term = normalize(q);
    const results = [
      ...articles
        .filter((a) =>
          normalize([a.title, a.excerpt, a.topic?.title].filter(Boolean).join(' ')).includes(term),
        )
        .map((a) => ({
          title: a.title,
          excerpt: a.excerpt,
          href: `/textos/${a.slug.current}`,
          type: 'Texto',
        })),
      ...fragments
        .filter((f) => normalize([f.text, f.topic?.title].join(' ')).includes(term))
        .map((f) => ({ title: f.text, href: `/fragmentos#${f._id}`, type: 'Fragmento' })),
    ].slice(0, 20);
    return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Busca indisponível.' }, { status: 503 });
  }
}
