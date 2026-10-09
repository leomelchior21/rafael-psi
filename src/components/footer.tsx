import Link from 'next/link';
import { Logo } from './logo';
import type { Settings } from '@/lib/types';
import { safeHref } from '@/lib/utils';
const navigation = [
  ['Textos', '/textos'],
  ['Fragmentos', '/fragmentos'],
  ['Clínica', '/clinica'],
  ['Sobre', '/sobre'],
  ['Contato', '/contato'],
];
export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <Logo image={settings.logoHorizontal} />
          <nav aria-label="Navegação do rodapé">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rafael Rodrigues</p>
          <p>Psicanálise, cidade e palavra.</p>
          <div>
            {safeHref(settings.instagram) && (
              <a href={safeHref(settings.instagram)} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {safeHref(settings.linkedin) && (
              <a href={safeHref(settings.linkedin)} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            <Link href="/creditos">Créditos</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
