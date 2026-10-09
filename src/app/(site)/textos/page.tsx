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
    <div className="texts-page">
      <div className="container texts-container">
        <ArticleArchive articles={articles} topics={topics} />
      </div>
    </div>
  );
}
