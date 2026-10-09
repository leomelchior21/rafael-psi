import Link from 'next/link';
import { getHome, getSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { EditorialImage } from '@/components/editorial-image';
import { SectionHeading } from '@/components/section-heading';
import { ArticleCard } from '@/components/article-card';
import { FragmentCard } from '@/components/fragment-card';
import { Arrow } from '@/components/icons';
export async function generateMetadata() {
  const [home, settings] = await Promise.all([getHome(), getSettings()]);
  return pageMetadata(
    home.homepageSEO?.title || settings.seoTitle || 'Psicanálise, cidade e palavra',
    home.homepageSEO?.description || settings.seoDescription || 'Escuta, pensamento e vida urbana.',
    '/',
    home.homepageSEO?.image || settings.ogImage || home.heroImage,
  );
}
export default async function HomePage() {
  const home = await getHome();
  const articles = (home.featuredArticles || []).filter((a) => a?.slug?.current);
  const fragments = (home.featuredFragments || []).filter((f) => f);
  const fragmentImage = fragments.find((f) => f.image)?.image;
  return (
    <>
      <section className="hero ink-surface">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">Rafael Rodrigues · Psicanálise</p>
            <h1>{home.heroTitle || 'Psicanálise,\ncidade e palavra'}</h1>
            <p className="hero-subtitle">
              {home.heroSubtitle || 'Escuta, pensamento\ne vida urbana.'}
            </p>
            <div className="hero-actions">
              <Link className="pill pill-paper" href="/textos">
                {home.heroPrimaryCTA || 'Ler'}
                <Arrow />
              </Link>
              <Link className="pill pill-outline" href="/clinica">
                {home.heroSecondaryCTA || 'Clínica'}
              </Link>
            </div>
          </div>
          <div className="hero-photo">
            <EditorialImage
              image={home.heroImage}
              priority
              ratio={0.9}
              sizes="(max-width:700px) 100vw, 58vw"
            />
            <span className="hero-photo-caption">São Paulo · entre o movimento e a pausa</span>
          </div>
          <div className="hero-footnote">
            <span>Um espaço de escrita e escuta</span>
            <span>
              01 — Percursos <span aria-hidden="true">↓</span>
            </span>
          </div>
        </div>
      </section>
      <section className="section texts-section">
        <div className="container">
          <SectionHeading title="Textos" href="/textos" />
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          {!articles.length && <p className="empty-state">Os primeiros textos chegam em breve.</p>}
        </div>
      </section>
      <section className="fragments-section ink-surface">
        <div className="container fragments-layout">
          <div className="fragments-copy">
            <SectionHeading title="Fragmentos" href="/fragmentos" label="Explorar" />
            <div className="home-fragments">
              {fragments.map((fragment) => (
                <FragmentCard key={fragment._id} fragment={fragment} />
              ))}
            </div>
            {!fragments.length && <p>Pequenas notas, perguntas em aberto.</p>}
          </div>
          {fragmentImage && (
            <EditorialImage image={fragmentImage} className="fragment-photo" ratio={1.15} />
          )}
        </div>
      </section>
      <section className="section clinic-section">
        <div className="container clinic-layout">
          <div>
            <span className="eyebrow">A prática da escuta</span>
            <h2>{home.clinicTitle || 'Clínica'}</h2>
            <p>{home.clinicShortText || 'Atendimento psicanalítico.'}</p>
            <Link href="/clinica" className="text-link clinic-link" aria-label="Conhecer a clínica">
              <span>Conhecer a clínica</span>
              <Arrow />
            </Link>
          </div>
          <Link href="/clinica" className="clinic-image-link" aria-label="Conhecer o atendimento">
            <EditorialImage
              image={home.clinicImage}
              ratio={1.8}
              sizes="(max-width:700px) 90vw, 60vw"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
