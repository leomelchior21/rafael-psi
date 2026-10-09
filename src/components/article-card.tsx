import Link from 'next/link';
import type { Article } from '@/lib/types';
import { EditorialImage } from './editorial-image';
import { Arrow } from './icons';
import { dateLabel } from '@/lib/utils';
export function ArticleCard({
  article,
  archive = false,
  featured = false,
  index = 0,
}: {
  article: Article;
  archive?: boolean;
  featured?: boolean;
  index?: number;
}) {
  return (
    <article
      className={`article-card ${featured ? 'featured-card' : ''}`}
      data-reveal
      data-reveal-delay={featured ? index * 0.08 : undefined}
    >
      <Link href={`/textos/${article.slug.current}`} className="article-card-link">
        <EditorialImage
          image={article.heroImage}
          ratio={1.3}
          sizes={
            featured
              ? '(max-width: 800px) 90vw, 30vw'
              : '(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw'
          }
        />
        {article.topic && <p className="meta card-topic">{article.topic.title}</p>}
        <div className="card-title">
          <h3>{article.title}</h3>
          <span className="circle-arrow">
            <Arrow diagonal />
          </span>
        </div>
      </Link>
      {archive && (
        <p className="meta card-date">
          <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt)}</time>
        </p>
      )}
    </article>
  );
}
