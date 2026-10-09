import { getArticles, getTopics } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { ArticleArchive } from '@/components/article-archive';
export const metadata = pageMetadata(
  'Textos',
  'Ensaios e percursos entre a psicanálise, a cidade e a vida cotidiana.',
  '/textos',
);
export default async function ArticlesPage() {
  const [articles, topics] = await Promise.all([getArticles(), getTopics()]);
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Arquivo editorial</span>
        <h1>Textos</h1>
        <p>Ideias que pedem um pouco mais de tempo.</p>
      </div>
      <ArticleArchive articles={articles} topics={topics} />
    </div>
  );
}
