import type { Fragment } from '@/lib/types';
export function FragmentCard({ fragment, typedText }: { fragment: Fragment; typedText?: string }) {
  return (
    <blockquote className="fragment-card">
      <p>
        {typedText === undefined ? (
          <>“{fragment.text}”</>
        ) : (
          <>
            <span className="sr-only">“{fragment.text}”</span>
            <span className="fragment-typewriter" aria-hidden="true">
              <span className="fragment-measure">“{fragment.text}”</span>
              <span className="fragment-typed">
                “{typedText}
                {typedText === fragment.text ? '”' : ''}
              </span>
            </span>
          </>
        )}
      </p>
      {(fragment.author || fragment.source) && (
        <cite>{[fragment.author, fragment.source].filter(Boolean).join(' · ')}</cite>
      )}
      <span className="fragment-dash" aria-hidden="true" />
      {fragment.demo && <span className="meta">Fragmento demonstrativo</span>}
    </blockquote>
  );
}
