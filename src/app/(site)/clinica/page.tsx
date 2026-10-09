import Link from 'next/link';
import { getClinic, getSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { whatsappUrl } from '@/lib/utils';
import { EditorialImage } from '@/components/editorial-image';
import { PortableTextRenderer } from '@/components/portable-text';
import { Arrow } from '@/components/icons';
export async function generateMetadata() {
  const page = await getClinic();
  return pageMetadata(
    page.seo?.title || 'Clínica',
    page.seo?.description || 'A prática da escuta. Atendimento psicanalítico com Rafael Rodrigues.',
    '/clinica',
    page.seo?.image || page.clinicImage,
  );
}
export default async function ClinicPage() {
  const [page, settings] = await Promise.all([getClinic(), getSettings()]);
  const whatsapp = whatsappUrl(settings.whatsapp);
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Psicanálise</span>
        <h1>{page.title || 'Clínica'}</h1>
        <p>{page.intro}</p>
      </div>
      <EditorialImage image={page.clinicImage} className="clinic-cover" priority ratio={2.15} />
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
        </aside>
        <div>
          <PortableTextRenderer value={page.body} />
          <div className="first-contact">
            <h2>Primeiro contato</h2>
            <p>{page.contactText || 'Para informações sobre atendimento, entre em contato.'}</p>
            <Link className="text-link" href={whatsapp || '/contato'}>
              {page.whatsappCTA || 'Entrar em contato'}
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
