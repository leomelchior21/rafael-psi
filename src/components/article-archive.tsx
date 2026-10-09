'use client';
import { useState } from 'react';
import type { Article, Topic } from '@/lib/types';
import { ArticleCard } from './article-card';
export function ArticleArchive({ articles, topics }: { articles: Article[]; topics: Topic[] }) {
  const [topic, setTopic] = useState('all');
  const filtered = articles.filter((article) => topic === 'all' || article.topic?._id === topic);
  return (
    <>
      <div className="topic-filters" aria-label="Filtrar textos por tema">
        <button aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
          Todos
        </button>
        {topics.map((item) => (
          <button
            key={item._id}
            aria-pressed={topic === item._id}
            onClick={() => setTopic(item._id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {filtered.length} textos encontrados
      </p>
      <div className="article-grid archive-grid">
        {filtered.map((article) => (
          <ArticleCard key={article._id} article={article} archive />
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-state">Ainda não há textos publicados neste tema.</p>
      )}
    </>
  );
}
