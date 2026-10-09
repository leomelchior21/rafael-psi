import { getFragments } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { dateLabel } from '@/lib/utils';
import { EditorialImage } from '@/components/editorial-image';
export const metadata = pageMetadata(
  'Fragmentos',
  'Notas de leitura, breves observações e perguntas em aberto.',
  '/fragmentos',
);
export default async function FragmentsPage() {
  const fragments = await getFragments();
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Um caderno aberto</span>
        <h1>Fragmentos</h1>
        <p>Nem toda ideia precisa terminar.</p>
      </div>
      <div className="notebook">
        {fragments.map((fragment, i) => (
          <article key={fragment._id} id={fragment._id} className="notebook-entry">
            <aside className="meta">
              <span className="entry-number">{String(i + 1).padStart(2, '0')}</span>
              <time dateTime={fragment.publishedAt}>{dateLabel(fragment.publishedAt)}</time>
              {fragment.topic && <span>{fragment.topic.title}</span>}
            </aside>
            <div>
              <blockquote>
                <p>{fragment.text}</p>
                {(fragment.author || fragment.source) && (
                  <cite>{[fragment.author, fragment.source].filter(Boolean).join(' · ')}</cite>
                )}
              </blockquote>
              {fragment.demo && <p className="demo-label">Fragmento demonstrativo</p>}
              {fragment.image && <EditorialImage image={fragment.image} caption ratio={1.6} />}
            </div>
          </article>
        ))}
        {!fragments.length && (
          <p className="empty-state">Este caderno receberá seus primeiros fragmentos em breve.</p>
        )}
      </div>
    </div>
  );
}
