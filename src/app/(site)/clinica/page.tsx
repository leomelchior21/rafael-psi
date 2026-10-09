import Link from 'next/link';
import { getClinic, getSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { whatsappUrl } from '@/lib/utils';
import { EditorialImage } from '@/components/editorial-image';
import { PortableTextRenderer } from '@/components/portable-text';
import { Arrow } from '@/components/icons';
import { RevealHeading } from '@/components/reveal-heading';
import type { EditorialPhoto } from '@/lib/types';

const illustrativeInterior: EditorialPhoto = {
  localPath: '/images/clinica-escuta.webp',
  alt: 'Interior ilustrativo de um consultório, com poltrona, livros e luz natural.',
};
export async function generateMetadata() {
  const page = await getClinic();
  return pageMetadata(
    page.seo?.title || 'Clínica',
    page.seo?.description || 'A prática da escuta. Atendimento psicanalítico com Rafael Rodrigues.',
    '/clinica',
    page.seo?.image || page.heroImage || page.clinicImage,
  );
}
export default async function ClinicPage() {
  const [page, settings] = await Promise.all([getClinic(), getSettings()]);
  const whatsapp = whatsappUrl(settings.whatsapp);
  const contactHref = whatsapp || '/contato';
  return (
    <div className="clinic-page">
      <section className="container clinic-hero">
        <div className="clinic-opening-copy">
          <span className="eyebrow clinic-eyebrow" data-reveal>
            {page.title || 'Clínica'}
          </span>
          <RevealHeading text={page.heroTitle || 'Um espaço\npara escutar\no que insiste.'} />
          {page.intro && (
            <p className="clinic-opening-intro" data-reveal>
              {page.intro}
            </p>
          )}
          <Link className="clinic-contact-button" href={contactHref} data-reveal data-magnetic>
            {page.whatsappCTA || 'Agendar conversa'} <Arrow />
          </Link>
        </div>
        <div className="clinic-visual">
          <div className="clinic-photo-wrap">
            <EditorialImage
              image={page.heroImage || illustrativeInterior}
              className="clinic-hero-photo"
              priority
              ratio={0.98}
              sizes="(max-width: 700px) 90vw, (max-width: 1100px) 65vw, 50vw"
              reveal="vertical"
              depth
            />
            {!page.heroImage && <p className="clinic-image-caption">Imagem ilustrativa.</p>}
          </div>
          <blockquote className="clinic-glass" data-reveal data-reveal-delay="0.3">
            <span className="clinic-quote-mark" aria-hidden="true">
              “
            </span>
            <p>{page.heroQuote || 'Nem tudo o que sentimos se explica. Mas pode ser escutado.'}</p>
            <footer>
              {page.heroQuoteCaption || 'A clínica como possibilidade de outra narrativa.'}
            </footer>
          </blockquote>
        </div>
      </section>
      <section className="container clinic-details">
        <div className="information-layout">
          <aside>
            <h2>Atendimento</h2>
            {page.city && <p className="meta">{page.city}</p>}
            <ul className="modality-list">
              {page.modalities?.map((item) => (
                <li key={item}>
                  {item}
                  <span aria-hidden="true">↗</span>
                </li>
              ))}
            </ul>
            {page.clinicImage && (
              <EditorialImage
                image={page.clinicImage}
                className="clinic-context-photo"
                ratio={1.3}
                sizes="(max-width: 700px) 85vw, 25vw"
              />
            )}
          </aside>
          <div>
            <PortableTextRenderer value={page.body} />
            <div className="first-contact">
              <h2>Primeiro contato</h2>
              <p>{page.contactText || 'Para informações sobre atendimento, entre em contato.'}</p>
              <Link className="text-link" href={contactHref}>
                {page.whatsappCTA || 'Entrar em contato'}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
