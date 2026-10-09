import { getAbout } from '@/lib/content';
import { pageMetadata, siteUrl } from '@/lib/metadata';
import { jsonLd } from '@/lib/utils';
import { EditorialImage } from '@/components/editorial-image';
import { PortableTextRenderer } from '@/components/portable-text';
export async function generateMetadata() {
  const page = await getAbout();
  return pageMetadata(
    page.seo?.title || 'Sobre',
    page.seo?.description ||
      'O percurso de Rafael Rodrigues entre a psicanálise, a escuta e a escrita.',
    '/sobre',
    page.seo?.image || page.portrait,
  );
}
export default async function AboutPage() {
  const page = await getAbout();
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Sobre</span>
        <h1>{page.title || 'Rafael Rodrigues'}</h1>
        <p>{page.intro}</p>
      </div>
      <div className={`about-layout ${page.portrait ? 'has-portrait' : ''}`}>
        {page.portrait && <EditorialImage image={page.portrait} priority ratio={0.8} />}
        <div>
          <PortableTextRenderer value={page.biography} />
          {!page.biography?.length && (
            <p className="empty-state">Este percurso será apresentado em breve.</p>
          )}
          {Boolean(page.trainingItems?.length) && (
            <section className="about-section">
              <h2>Formação e percurso</h2>
              {page.trainingItems?.map((item) => (
                <div key={item._key}>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </section>
          )}
          {page.additionalSections?.map((section) => (
            <section className="about-section" key={section._key}>
              <h2>{section.title}</h2>
              <PortableTextRenderer value={section.body} />
            </section>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Rafael Rodrigues',
            url: siteUrl,
          }),
        }}
      />
    </div>
  );
}
