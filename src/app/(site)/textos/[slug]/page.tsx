import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getArticles } from '@/lib/content';
import { pageMetadata, siteUrl } from '@/lib/metadata';
import { dateLabel, jsonLd } from '@/lib/utils';
import { imageUrl } from '@/sanity/images';
import { EditorialImage } from '@/components/editorial-image';
import { PortableTextRenderer } from '@/components/portable-text';
import { ShareButton } from '@/components/share-button';
import { SectionHeading } from '@/components/section-heading';
import { ArticleCard } from '@/components/article-card';
import { RevealHeading } from '@/components/reveal-heading';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const base = pageMetadata(
    article.seoTitle || article.title,
    article.seoDescription || article.excerpt || '',
    `/textos/${slug}`,
    article.ogImage || article.heroImage,
  );
  return {
    ...base,
    openGraph: { ...base.openGraph, type: 'article', publishedTime: article.publishedAt },
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const others = (await getArticles())
    .filter((a) => a._id !== article._id)
    .sort(
      (a, b) =>
        Number(b.topic?._id === article.topic?._id) - Number(a.topic?._id === article.topic?._id),
    )
    .slice(0, 3);
  return (
    <article className="article-page">
      <div className="container">
        <header className="article-heading">
          <Link href="/textos" className="text-link back-link">
            ← Textos
          </Link>
          <p className="eyebrow">
            {article.topic?.title} <span className="metadata-separator">/</span>{' '}
            <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>
          </p>
          <RevealHeading text={article.title} />
          {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
          {article.demo && (
            <p className="demo-label">
              Texto demonstrativo · a ser substituído por conteúdo autoral
            </p>
          )}
        </header>
        <EditorialImage
          image={article.heroImage}
          className="article-cover"
          priority
          caption
          ratio={1.9}
          reveal="horizontal"
          sizes="(max-width: 1300px) 90vw, 1280px"
        />
        <div className="reading-column">
          <PortableTextRenderer value={article.body} />
          <div className="article-end">
            <ShareButton title={article.title} />
            <Link href="/clinica" className="text-link">
              Conhecer a clínica →
            </Link>
          </div>
        </div>
        {others.length > 0 && (
          <section className="related-section">
            <SectionHeading title="Outros percursos" href="/textos" />
            <div className="article-grid">
              {others.map((item) => (
                <ArticleCard key={item._id} article={item} />
              ))}
            </div>
          </section>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            datePublished: article.publishedAt,
            description: article.excerpt,
            image: imageUrl(article.heroImage),
            ...(!article.demo ? { author: { '@type': 'Person', name: 'Rafael Rodrigues' } } : {}),
            mainEntityOfPage: `${siteUrl}/textos/${slug}`,
            inLanguage: 'pt-BR',
          }),
        }}
      />
    </article>
  );
}
