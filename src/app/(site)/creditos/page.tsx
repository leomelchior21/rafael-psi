import { getArticles, getHome, getFragments, getClinic, getAbout } from '@/lib/content';
import type { EditorialPhoto } from '@/lib/types';
import { safeHref } from '@/lib/utils';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Créditos',
  'Fontes e licenças das fotografias desta publicação.',
  '/creditos',
);
export default async function CreditsPage() {
  const [articles, home, fragments, clinic, about] = await Promise.all([
    getArticles(),
    getHome(),
    getFragments(),
    getClinic(),
    getAbout(),
  ]);
  const all = [
    home.heroImage,
    ...(home.heroGallery || []),
    home.clinicImage,
    clinic.clinicImage,
    about.portrait,
    ...articles.flatMap((a) => [
      a.heroImage,
      ...((a.body || []).filter((b) => b._type === 'editorialImage') as EditorialPhoto[]),
    ]),
    ...fragments.map((f) => f.image),
  ];
  const photos = Array.from(
    new Map(
      all
        .filter((p): p is EditorialPhoto => Boolean(p && (p.sourceUrl || p.photographer)))
        .map((p) => [p.asset?._ref || p.localPath || p.sourceUrl, p]),
    ).values(),
  );
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Colofão</span>
        <h1>Créditos</h1>
        <p>As imagens também têm um percurso.</p>
      </div>
      <div className="credits-list">
        {photos.map((photo, i) => (
          <article key={i}>
            <h2>{photo.alt}</h2>
            <p>Fotografia: {photo.photographer}</p>
            <p>
              <a href={safeHref(photo.sourceUrl)} target="_blank" rel="noreferrer">
                Fonte original ↗
              </a>
              {photo.license && (
                <>
                  {' '}
                  ·{' '}
                  <a href={safeHref(photo.licenseUrl)} target="_blank" rel="noreferrer">
                    {photo.license}
                  </a>
                </>
              )}
            </p>
            {photo.credit && <p className="meta">{photo.credit}</p>}
          </article>
        ))}
      </div>
      <p className="meta">
        Identidade visual fornecida por Rafael Rodrigues. Tipografia: Instrument Serif e DM Sans,
        sob licença SIL Open Font License.
      </p>
    </div>
  );
}
