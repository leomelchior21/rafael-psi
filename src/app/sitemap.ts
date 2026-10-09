import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/content';
import { siteUrl } from '@/lib/metadata';
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  return [
    ...[
      '',
      '/textos',
      '/fragmentos',
      '/clinica',
      '/sobre',
      '/contato',
      '/creditos',
      '/privacidade',
    ].map((path) => ({ url: `${siteUrl}${path}` })),
    ...articles.map((article) => ({
      url: `${siteUrl}/textos/${article.slug.current}`,
      lastModified: article.publishedAt,
    })),
  ];
}
