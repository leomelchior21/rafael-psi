import Link from 'next/link';
import { getHome, getSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { EditorialImage } from '@/components/editorial-image';
import { SectionHeading } from '@/components/section-heading';
import { ArticleCard } from '@/components/article-card';
import { FragmentCard } from '@/components/fragment-card';
import { Arrow } from '@/components/icons';
import { RevealHeading } from '@/components/reveal-heading';
import { HeroSlideshow, type HeroPhoto } from '@/components/hero-slideshow';
import { imageUrl } from '@/sanity/images';
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
  const fragments = (home.featuredFragments || []).filter((f) => f).slice(0, 2);
  const fragmentImage = fragments.find((f) => f.image)?.image;
  const gallery = home.heroGallery?.length
    ? home.heroGallery
    : articles.slice(0, 2).map((article) => article.heroImage);
  const heroPhotos: HeroPhoto[] = Array.from(
    new Map(
      [home.heroImage, ...gallery]
        .filter((photo) => Boolean(imageUrl(photo)))
        .map((photo) => [
          photo?.asset?._ref || photo?.localPath,
          {
            src: imageUrl(photo, 2000)!,
            position: photo?.hotspot
              ? `${photo.hotspot.x * 100}% ${photo.hotspot.y * 100}%`
              : '60% center',
          },
        ]),
    ).values(),
  ).slice(0, 5);
  return (
    <>
      <section className="hero ink-surface">
        <HeroSlideshow photos={heroPhotos} />
        <div className="hero-photo-treatment" aria-hidden="true" />
        <div className="hero-brush" aria-hidden="true" />
        <div className="hero-readability" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">Rafael Rodrigues · Psicanálise</p>
            <RevealHeading text={home.heroTitle || 'Psicanálise,\ncidade e palavra'} />
            <p className="hero-subtitle">
              {home.heroSubtitle || 'Escuta, pensamento\ne vida urbana.'}
            </p>
            <div className="hero-actions">
              <Link className="editorial-action" href="/textos" data-magnetic>
                {home.heroPrimaryCTA || 'Ler'}
                <Arrow />
              </Link>
              <Link
                className="editorial-action editorial-action-secondary"
                href="/clinica"
                data-magnetic
              >
                {home.heroSecondaryCTA || 'Clínica'}
                <Arrow />
              </Link>
            </div>
          </div>
          <div className="hero-footnote">
            <span>Um espaço de escrita e escuta</span>
          </div>
        </div>
      </section>
      <section className="section texts-section">
        <div className="container">
          <SectionHeading title="Textos" href="/textos" />
          <div className="article-grid featured-grid">
            {articles.map((article, index) => (
              <ArticleCard key={article._id} article={article} featured index={index} />
            ))}
          </div>
          {!articles.length && <p className="empty-state">Os primeiros textos chegam em breve.</p>}
        </div>
      </section>
      <section className="fragments-section ink-surface">
        <div className="container fragments-layout">
          <div className="fragments-copy">
            <SectionHeading title="Fragmentos" href="/fragmentos" label="Explorar" />
            <div className="home-fragments" data-stagger>
              {fragments.map((fragment) => (
                <FragmentCard key={fragment._id} fragment={fragment} />
              ))}
            </div>
            {!fragments.length && <p>Pequenas notas, perguntas em aberto.</p>}
          </div>
          {fragmentImage && (
            <EditorialImage
              image={fragmentImage}
              className="fragment-photo"
              ratio={0.95}
              reveal="vertical"
              depth
              delay={0.3}
            />
          )}
        </div>
      </section>
      <section className="section clinic-section">
        <div className="container clinic-layout">
          <div className="clinic-copy" data-reveal>
            <span className="eyebrow">A prática da escuta</span>
            <h2>{home.clinicTitle || 'Clínica'}</h2>
            <p>{home.clinicShortText || 'Atendimento psicanalítico.'}</p>
            <Link
              href="/clinica"
              className="text-link clinic-link"
              aria-label="Conhecer a clínica"
              data-magnetic
            >
              <span>Conhecer a clínica</span>
              <Arrow />
            </Link>
          </div>
          <Link href="/clinica" className="clinic-image-link" aria-label="Conhecer o atendimento">
            <EditorialImage
              image={home.clinicImage}
              ratio={1.5}
              reveal="horizontal"
              depth
              sizes="(max-width:800px) 90vw, 60vw"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
