import { getContact, getSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';
import { whatsappUrl } from '@/lib/utils';
import { deliverableEmail } from '@/lib/contact';
import { ContactForm } from '@/components/contact-form';
import { Arrow } from '@/components/icons';
export async function generateMetadata() {
  const page = await getContact();
  return pageMetadata(
    page.seo?.title || 'Contato',
    page.seo?.description || 'Entre em contato com Rafael Rodrigues.',
    '/contato',
    page.seo?.image,
  );
}
export default async function ContactPage() {
  const [page, settings] = await Promise.all([getContact(), getSettings()]);
  const email = page.email || settings.email;
  const recipient = page.formRecipient || email;
  const validRecipient = deliverableEmail(recipient) ? recipient : undefined;
  const whatsapp = whatsappUrl(page.whatsapp || settings.whatsapp);
  return (
    <div className="container page-section contact-page">
      <div className="page-heading">
        <span className="eyebrow">Uma primeira palavra</span>
        <h1>{page.title || 'Contato'}</h1>
        <p>{page.intro || 'Uma conversa pode começar\ncom algumas palavras.'}</p>
      </div>
      <div className="contact-layout">
        <aside className="contact-details">
          {deliverableEmail(email) && (
            <a className="text-link" href={`mailto:${email}`}>
              {email}
              <Arrow diagonal />
            </a>
          )}
          {whatsapp && (
            <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
              <Arrow diagonal />
            </a>
          )}
          {!deliverableEmail(email) && !whatsapp && (
            <p className="placeholder-contact">
              Lorem ipsum
              <br />
              <span className="meta">Dados de contato em breve.</span>
            </p>
          )}
          {settings.enderecoOpcional && <p>{settings.enderecoOpcional}</p>}
        </aside>
        {page.formEnabled !== false && (
          <ContactForm
            recipient={validRecipient}
            directDelivery={Boolean(
              process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && validRecipient,
            )}
          />
        )}
      </div>
    </div>
  );
}
