import type { Metadata } from 'next';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import './globals.css';
import './editorial.css';
import './hero.css';
import './archive.css';
import './clinic.css';
import { siteUrl } from '@/lib/metadata';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rafael Rodrigues — Psicanálise, cidade e palavra',
    template: '%s · Rafael Rodrigues',
  },
  description: 'Escuta, pensamento e vida urbana. Textos e fragmentos de Rafael Rodrigues.',
  robots:
    process.env.DEMO_MODE === 'true'
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
