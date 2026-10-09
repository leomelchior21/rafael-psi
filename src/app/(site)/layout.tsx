import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { getSettings, isDemo } from '@/lib/content';
import { SanityLive } from '@/sanity/live';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export const revalidate = 60;
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const draft = (await draftMode()).isEnabled;
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header logo={settings.logoHorizontal} />
      <main id="conteudo">{children}</main>
      <Footer settings={settings} />
      {isDemo && <aside className="demo-notice">Prévia editorial · conteúdo demonstrativo</aside>}
      {draft && (
        <aside className="preview-notice">
          Pré-visualização de rascunhos{' '}
          <form action="/api/draft-mode/disable" method="post">
            <button type="submit">Sair</button>
          </form>
        </aside>
      )}
      {!isDemo && <SanityLive />}
      {draft && <VisualEditing />}
    </>
  );
}
