import type { Fragment } from '@/lib/types';
export function FragmentCard({ fragment }: { fragment: Fragment }) {
  return (
    <blockquote className="fragment-card">
      <p>“{fragment.text}”</p>
      {(fragment.author || fragment.source) && (
        <cite>{[fragment.author, fragment.source].filter(Boolean).join(' · ')}</cite>
      )}
      <span className="fragment-dash" aria-hidden="true" />
      {fragment.demo && <span className="meta">Fragmento demonstrativo</span>}
    </blockquote>
  );
}
