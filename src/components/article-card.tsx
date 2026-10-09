import Link from 'next/link';
import type { Article } from '@/lib/types';
import { EditorialImage } from './editorial-image';
import { Arrow } from './icons';
import { dateLabel } from '@/lib/utils';
export function ArticleCard({ article, archive = false }: { article: Article; archive?: boolean }) {
  return (
    <article className="article-card">
      <Link href={`/textos/${article.slug.current}`} className="article-card-link">
        <EditorialImage
          image={article.heroImage}
          ratio={1.3}
          sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw"
        />
        <div className="card-title">
          <h3>{article.title}</h3>
          <span className="circle-arrow">
            <Arrow diagonal />
          </span>
        </div>
      </Link>
      <p className="meta">
        {article.topic?.title}
        {archive && article.topic ? <span> / </span> : ''}
        {archive && <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>}
      </p>
    </article>
  );
}
